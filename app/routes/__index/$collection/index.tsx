import { useEffect, useRef, useReducer } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useTransition,
  useFetcher,
  useLoaderData,
  NavLink,
} from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";
import { Progress } from '@chakra-ui/react';

import {
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'

import { PAGE_LIMIT } from '~/shared/constants';
import type { CategoriesMap, Product, Category } from '~/shared/types';
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs';
import LoadMoreButton from '~/components/LoadMoreButton';
import { normalizeToMap, fetchCategories } from '~/api/categories.server';
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { commitSession } from '~/sessions/sessions';
import {
  getCanonicalDomain,
  getCollectionDescText,
  getCollectionTitleText,
  getCategoryFBSEO,
} from '~/utils/seo';
import PageTitle from '~/components/PageTitle';
import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';

import reducer, { CollectionActionType } from './reducer';
import styles from '../styles/ProductList.css';
import { fetchProductsByCategoryV2 } from "../api";
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer';
import { modToXItems } from "../utils";

type LoaderDataType = {
  categories: CategoriesMap;
  products: Product[];
  category: Category;
  page: number;
  canonical_link: string;
  navBarCategories: Category[];
  total: number;
  current: number;
  hasMore: boolean;
};

type LoadMoreDataType = {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: Category,
  page: number,
  navBarCategories: Category[];
};

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => ([
  {
    rel: 'canonical', href: data
      ? data.canonical_link
      : getCanonicalDomain(),
  },
])

export const handle = { dynamicLinks }
export const meta: MetaFunction = ({ data }: { data: LoaderDataType }) => ({
  title: getCollectionTitleText(data?.category.title),
  description: getCollectionDescText(data?.category.title),

  ...getCategoryFBSEO(data?.category.title)
});

export const links: LinksFunction = () => {
  return [
    ...FourOhFourLinks(),
    ...ProductRowsContainerLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderType = 'load_category_products';

const _loadMoreLoader = async (request: Request, collection: string, page: number, perpage: number) => {
  const [categories, navBarCategories] = await fetchCategories();
  const catMap = await normalizeToMap(categories);

  if (!catMap[collection]) {
    throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  }

  const {
    items: products,
    current,
    total,
    hasMore,
  } = await fetchProductsByCategoryV2({
    perpage,
    page,
    category: Number(catMap[collection].catId),
  })

  return json<LoadMoreDataType>({
    products,
    total,
    current,
    hasMore,
    category: catMap[collection],
    page,
    navBarCategories,
  }, {
    headers: {
      'Set-Cookie': await commitSession(
        await addCategoryProducts(request, [], collection, page)
      ),
    },
  });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const actinType = url.searchParams.get('action_type') as LoaderType;
  const { collection = '' } = params;

  if (actinType === 'load_category_products') {
    const page = Number(url.searchParams.get('page'));
    const perpage = Number(url.searchParams.get('per_page')) || PAGE_LIMIT;
    return _loadMoreLoader(request, collection, page, perpage);
  }

  const [categories, navBarCategories] = await fetchCategories();
  const catMap = normalizeToMap(categories);

  if (!catMap[collection]) {
    throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  }

  const cachedProds = await getCategoryProducts(request, collection);

  if (cachedProds) {
    const {
      items: prods,
      total,
      current,
      hasMore,
    } = await fetchProductsByCategoryV2({
      perpage: PAGE_LIMIT * cachedProds.page,
      category: Number(catMap[collection].catId),
      random: false,
    });

    return json<LoaderDataType>({
      categories: catMap,
      category: catMap[collection],
      products: prods,

      page: cachedProds.page,
      total,
      current,
      hasMore,

      navBarCategories,
      canonical_link: `${getCanonicalDomain()}/${collection}`,
    });
  }

  // First time loaded so it must be first page.
  const {
    items: prods,
    total,
    current,
    hasMore,
  } = await fetchProductsByCategoryV2({
    perpage: PAGE_LIMIT,
    page: 1,
    category: Number(catMap[collection].catId),
  })

  const session = await addCategoryProducts(request, [], collection, 1);

  return json<LoaderDataType>({
    categories: catMap,
    products: prods,
    page: 1,
    total,
    current,
    hasMore,
    category: catMap[collection],
    navBarCategories,
    canonical_link: `${getCanonicalDomain()}/${collection}`,
  }, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

// TODO: extract action type logic to independent function.
export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();
  const productID = body.get("product_id");
  return redirect(`/product/${productID}`);
};

// When collection is not found
export const CatchBoundary = () => (<FourOhFour />);

const getCategoryFromWindowPath = (window: Window): string => {
  const pathname = window.location.pathname;
  const category = pathname.substring(pathname.lastIndexOf('/') + 1);
  return category;
};

type CollectionProps = {} & LazyComponentProps;

function Collection({ scrollPosition }: CollectionProps) {
  const {
    category,
    products,
    page,
    categories,
    total,
    current,
    hasMore,
  } = useLoaderData<LoaderDataType>();

  const [state, dispatch] = useReducer(reducer, {
    productRows: modToXItems(products, 8),
    products,
    current,
    total,
    hasMore
  });

  const currPage = useRef(state.current);

  const loadmoreFetcher = useFetcher();
  const transition = useTransition();

  // For any subsequent change of category, we will update current product info coming from loader data.
  useEffect(() => {
    dispatch({
      type: CollectionActionType.set_products,
      payload: {
        products,
        total,
        current,
      },
    });
    currPage.current = page;
  }, [category]);


  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      const {
        products,
        total,
        current,
        page,
        category:
        dataCat,
      } = loadmoreFetcher.data as LoadMoreDataType;
      // If user changes category while load more is happening, the newly loaded data
      // would be appended to different category. Moreover, it would cause inconsistent
      // page number. Thus, we abandon appending loaded data on to the product list
      // if category of data is different from current viewing category.
      if (
        products.length === 0 ||
        dataCat.name !== category.name
      ) return;

      currPage.current = page;

      dispatch({
        type: CollectionActionType.append_products,
        payload: {
          products,
          total,
          current,
        },
      });
    }
  }, [loadmoreFetcher.type, category]);


  const handleLoadMore = () => {
    const category = getCategoryFromWindowPath(window);
    const nextPage = currPage.current + 1;

    loadmoreFetcher.submit(
      {
        action_type: 'load_category_products',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      { action: `/${decodeURI(category)}?index` },
    );
  };

  const isChangingCategory = transition.state !== 'idle' &&
    transition.location &&
    categories.hasOwnProperty(
      decodeURI(transition.location.pathname.substring(1))
    );

  return (
    <div className="
      py-0 px-auto
      flex flex-col
      justify-center items-center
      mx-2 md:mx-4
    ">
      <div className="w-full py-2.5 max-w-screen-xl mx-auto">
        <Breadcrumbs breadcrumbs={
          [
            <BreadcrumbItem key="1">
              <BreadcrumbLink as={NavLink} to='/' className="font-semibold">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>,
            <BreadcrumbItem key="2">
              <BreadcrumbLink
                as={NavLink}
                to={`/${category.name}`}
                isCurrentPage
                className="font-semibold !text-[#D02E7D]"
              >
                {category.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ]
        } />
      </div>

      <PageTitle
        title={category.title}
        subtitle={category.description}
      />

      <ProductRowsContainer
        loading={isChangingCategory}
        productRows={state.productRows}
        scrollPosition={scrollPosition}
      />

      <div className="
        p-4 w-[300px]
        flex justify-center items-center
        flex-col gap-4
      ">
        <p className="font-poppins">
          Showing {state.current} of {state.total}
        </p>

        <Progress
          className="w-full"
          size='sm'
          value={Math.floor((state.current / state.total) * 100)}
          colorScheme='teal'
        />

        {
          state.hasMore
            ? (
              <LoadMoreButton
                loading={loadmoreFetcher.state !== 'idle'}
                onClick={handleLoadMore}
                text='Show More'
              />
            )
            : (
              <p className="font-poppins capitalize font-medium">
                Reaches end of list.
              </p>
            )
        }
      </div>
    </div>
  );
}

export default trackWindowScroll(Collection);