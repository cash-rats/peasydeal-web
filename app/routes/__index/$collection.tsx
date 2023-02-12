import { useState, useEffect, useRef } from "react";
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

import {
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'

import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import { PAGE_LIMIT } from '~/shared/constants';
import type { CategoriesMap, Product, Category } from '~/shared/types';
import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { normalizeToMap, fetchCategories } from '~/api/categories.server';
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { commitSession } from '~/sessions/sessions';
import {
  getCanonicalDomain,
  getCollectionDescText,
  getCollectionTitleText,
  getCategoryFBSEO,
} from '~/utils/seo';
import { checkHasMoreRecord } from '~/utils';
import PageTitle from '~/components/PageTitle';
import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';

import styles from './styles/ProductList.css';
import { fetchProductsByCategoryV2 } from "./api";
import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { modToXItems } from "./utils";

type LoaderDataType = {
  categories: CategoriesMap;
  products: Product[];
  category: Category;
  page: number;
  canonical_link: string;
  has_more: boolean;
};

type ActionDataType = {
  products: Product[],
  category: Category,
  page: number,
  has_more: boolean,
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
    ...CssSpinnerLinks(),
    ...ProductRowsContainerLinks(),
    ...LoadmoreLinks(),
    ...LoadMoreButtonLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderType = 'load_category_products';

const _loadMoreLoader = async (request: Request, collection: string, page: number, perPage: number) => {
  const catMap = await normalizeToMap(await fetchCategories());
  if (!catMap[collection]) {
    throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  }

  const products = await fetchProductsByCategoryV2({
    perpage: perPage,
    page,
    category: Number(catMap[collection].catId),
  })

  return json<ActionDataType>({
    products,
    category: catMap[collection],
    page,
    has_more: checkHasMoreRecord(products.length, PAGE_LIMIT),
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

  const catMap = await normalizeToMap(await fetchCategories());
  if (!catMap[collection]) {
    throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  }

  const cachedProds = await getCategoryProducts(request, collection);
  if (cachedProds) {
    const prods = await fetchProductsByCategoryV2({
      perpage: PAGE_LIMIT * cachedProds.page,
      category: Number(catMap[collection].catId),
      random: false,
    });

    return json<LoaderDataType>({
      categories: catMap,
      category: catMap[collection],
      products: prods,
      page: cachedProds.page,
      canonical_link: `${getCanonicalDomain()}/${collection}`,
      has_more: checkHasMoreRecord(prods.length, PAGE_LIMIT),
    });
  }

  // First time loaded so it must be first page.
  const prods = await fetchProductsByCategoryV2({
    perpage: PAGE_LIMIT,
    page: 1,
    category: Number(catMap[collection].catId),
  })

  const session = await addCategoryProducts(request, [], collection, 1);
  // const cookieSession = await setCategories(request, catMap);

  return json<LoaderDataType>({
    categories: catMap,
    products: prods,
    page: 1,
    category: catMap[collection],
    canonical_link: `${getCanonicalDomain()}/${collection}`,
    has_more: checkHasMoreRecord(prods.length, PAGE_LIMIT),
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
  const { category, products, page, has_more, categories } = useLoaderData<LoaderDataType>();

  // "productRows" is for displaying products on the screen.
  const [productRows, setProductRows] = useState<Product[][]>(
    modToXItems(products, 8)
  );

  const [hasMore, setHasMore] = useState(has_more);
  const currPage = useRef(page);

  const loadmoreFetcher = useFetcher();
  const transition = useTransition();

  // For any subsequent change of category, we will update current product info coming from loader data.
  useEffect(() => {
    setProductRows(modToXItems(products, 8));
    currPage.current = page;
    setHasMore(has_more);
  }, [category]);


  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      const { products, has_more, page, category: dataCat } = loadmoreFetcher.data as ActionDataType;
      // If user changes category while load more is happening, the newly loaded data
      // would be appended to different category. Moreover, it would cause inconsistent
      // page number. Thus, we abandon appending loaded data on to the product list
      // if category of data is different from current viewing category.
      if (
        products.length === 0 ||
        dataCat.name !== category.name
      ) return;

      currPage.current = page;

      setHasMore(has_more);

      setProductRows(prev => prev.concat(modToXItems(products)));
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
      { action: `/${decodeURI(category)}` },
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
        productRows={productRows}
        scrollPosition={scrollPosition}
      />

      <div className="ProductList__loadmore-container">
        {
          hasMore
            ? (
              <LoadMore
                spinner={<CssSpinner scheme='spinner' />}
                loading={loadmoreFetcher.state !== 'idle'}
                callback={handleLoadMore}
                delay={100}
                offset={150}
              />
            )
            :
            <LoadMoreButton
              loading={loadmoreFetcher.state !== 'idle'}
              onClick={handleLoadMore}
              text='Load more'
            />
        }
      </div>
    </div>
  );

}

export default trackWindowScroll(Collection);