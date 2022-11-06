import { useState, useEffect, useRef, useCallback } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useTransition,
  useLocation,
  useFetcher,
  useLoaderData,
  NavLink,
  useBeforeUnload,
} from '@remix-run/react';
import { ClientOnly } from 'remix-utils';
import httpStatus from 'http-status-codes';


import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import { PAGE_LIMIT } from '~/shared/constants';
import type { CategoriesMap, Product } from '~/shared/types';
import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { normalizeToMap, fetchCategories } from '~/categories.server';
import {
  getCategoryProducts,
  setCategoryProducts,
  addCategoryProducts,
} from '~/sessions/productlist.session';
import { getCategories } from '~/sessions/categories.session';
import { commitSession } from '~/sessions/redis_session';

import styles from './styles/ProductList.css';
import { fetchProductsByCategory } from "./api";
import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { organizeTo9ProdsPerRow } from "./utils";
// import {
//   getCategoryProductsMap,
//   initProductListInfoIfNotExists,
//   getCategoryProductListInfoFromLocalStorage,
//   writeCategoryProductMapToLocalStorage,
//   removeCategoryProductMapFromLocalStorage,
// } from './localstorage';


type LoaderType = {
  categories: CategoriesMap,
  products: Product[],
  category: string,
  page: number,
  has_more: boolean;
};

type ActionType = {
  products: Product[],
  category: string,
  page: number,
  has_more: boolean,
};

export const links: LinksFunction = () => {
  return [
    ...CssSpinnerLinks(),
    ...ProductRowsContainerLinks(),
    ...LoadmoreLinks(),
    ...BreadCrumbsLinks(),
    ...LoadMoreButtonLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};
const __loadCategoriesMap = async (request: Request) => {
  let catMap = await getCategories(request);
  if (!catMap) {
    catMap = normalizeToMap(await fetchCategories());;
  }
  return catMap;
}

const __loadCategoryProducts = async (category: string, page: number, perPage: number): Promise<{
  products: Product[],
  category: string,
  has_more: boolean,
}> => {


  const prods = await fetchProductsByCategory({
    perpage: perPage,
    page,
    category,
  })

  return {
    products: prods,
    has_more: prods.length === PAGE_LIMIT,
    category,
  };
}

const checkHasMoreRecord = (count: number, divisor: number) => count % divisor === 0;


export const loader: LoaderFunction = async ({ params, request }) => {
  const { collection = '' } = params;
  const catMap = await __loadCategoriesMap(request);

  if (!catMap[collection]) {
    throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  }

  const cachedProds = await getCategoryProducts(request, collection);
  if (cachedProds) {
    return json<LoaderType>({
      categories: catMap,
      category: collection,
      products: cachedProds.products,
      page: cachedProds.page,
      has_more: checkHasMoreRecord(cachedProds.products.length, PAGE_LIMIT),
    })
  }

  // First time loaded so it must be first page.
  const resp = await __loadCategoryProducts(collection, 1, PAGE_LIMIT);
  const session = await setCategoryProducts(request, collection, resp.products);
  // const cookieSession = await setCategories(request, catMap);

  return json<LoaderType>({
    categories: catMap,
    products: resp.products,
    page: 1,
    category: collection,
    has_more: checkHasMoreRecord(resp.products.length, PAGE_LIMIT),
  }, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

type __ActionType = 'redirect_to_prod' | 'load_category_products';

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();
  const actionType = body.get("__action") as __ActionType;

  if (actionType === 'load_category_products') {
    const page = Number(body.get("page") || '1');
    const perPage = Number(body.get("per_page")) || PAGE_LIMIT;
    const { collection = '' } = params;

    const resp = await __loadCategoryProducts(
      collection,
      page,
      perPage,
    );

    const session = await addCategoryProducts(request, resp.products, collection, page);

    return json<ActionType>({
      products: resp.products,
      category: collection,
      page,
      has_more: checkHasMoreRecord(resp.products.length, PAGE_LIMIT),
    }, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const productID = body.get("product_id");
  return redirect(`/product/${productID}`);
};

export const CatchBoundary = () => {
  return (
    <div>
      category not found.
    </div>
  );
};

const getCategoryFromWindowPath = (window: Window): string => {
  const pathname = window.location.pathname;
  const category = pathname.substring(pathname.lastIndexOf('/') + 1);
  return category;
};

function CollectionList() {
  const { category, products, page, has_more, categories } = useLoaderData<LoaderType>();

  // "productRows" is for displaying products on the screen.
  const [productRows, setProductRows] = useState<Product[][]>(organizeTo9ProdsPerRow(products));

  const [hasMore, setHasMore] = useState(has_more);
  const currPage = useRef(page);

  const loadmoreFetcher = useFetcher();
  const transition = useTransition();

  // For any subsequent change of category, we will try to find category data in cache first.
  // If it is found, we render it. If category data not found in the cache, we'll need to fetch it from server.
  useEffect(() => {
    setProductRows(organizeTo9ProdsPerRow(products));
    currPage.current = page;
  }, [category]);


  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      const { products, has_more, page } = loadmoreFetcher.data as ActionType;
      if (has_more) {
        currPage.current = page;
      }

      setHasMore(has_more);

      setProductRows(prev => prev.concat(organizeTo9ProdsPerRow(products)));
    }
  }, [loadmoreFetcher.type]);



  const handleLoadMore = () => {
    const category = getCategoryFromWindowPath(window);

    console.log('debug 1', currPage.current);
    const nextPage = currPage.current + 1;

    loadmoreFetcher.submit(
      {
        __action: 'load_category_products',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      {
        method: 'post',
        action: `/${decodeURI(category)}`,
      },
    );
  };

  const handleManualLoad = () => {
    const category = getCategoryFromWindowPath(window);
    const nextPage = currPage.current + 1;
    loadmoreFetcher.submit(
      {
        __action: 'load_category_products',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      {
        method: 'post',
        action: `/${category}`
      },
    );
  }

  const showSkeleton = transition.state !== 'idle' &&
    transition.location &&
    categories.hasOwnProperty(
      decodeURI(transition.location.pathname.substring(1))
    );

  return (
    <div className="prod-list-container">
      <ProductRowsContainer
        loading={showSkeleton}
        productRows={productRows}
      />
      {/* <ProductRowsContainer loading /> */}

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
              onClick={handleManualLoad}
              text='Load more'
            />
        }
      </div>
    </div>
  );

}

function CollectionWrapper() {
  return (
    <ClientOnly fallback={null}>
      {() => <CollectionList />}
    </ClientOnly>
  )
}

export default CollectionWrapper;