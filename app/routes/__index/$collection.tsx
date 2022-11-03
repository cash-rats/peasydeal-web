import { useState, useEffect, useRef, useCallback } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useTransition,
  useFetcher,
  useLoaderData,
  NavLink,
  useParams,
  useLocation,
} from '@remix-run/react';
import { ClientOnly } from 'remix-utils';
import httpStatus from 'http-status-codes';


import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';
import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { normalizeToMap, fetchCategories } from '~/categories.server';

import styles from './styles/ProductList.css';
import { fetchProductsByCategory } from "./api";
import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
// import {
//   ProductsContext,
//   addCollectionProducts,
//   setCollectionProducts,
//   selectCollectionProductRows,
// } from '../reducers/products_reducer';
import { organizeTo9ProdsPerRow } from "./utils";

type LoaderType = {
  category: string,
};

type ActionType = {
  products: Product[],
  has_more: boolean,
  category: string,
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

type __ActionType = 'redirect_to_prod' | 'load_category_products';

export const loader: LoaderFunction = async ({ params, request }) => {
  const { collection = '' } = params;

  return json<LoaderType>({
    category: collection,
  });
}

const __loadCategoryProducts = async (category: string, page: number, perPage: number) => {
  const catMap = normalizeToMap(await fetchCategories());
  const targetCat = catMap[category];
  if (!targetCat) {
    throw json(`target category ${category} not found`, httpStatus.NOT_FOUND);
  }

  const prods = await fetchProductsByCategory({
    perpage: perPage,
    page,
    category: catMap[category].catId,
  })

  return json<ActionType>({
    products: prods,
    has_more: prods.length === PAGE_LIMIT,
    category,
  });
}

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();
  const actionType = body.get("__action") as __ActionType;

  if (actionType === 'load_category_products') {
    const page = Number(body.get("page") || '1');
    const perPage = Number(body.get("per_page")) || PAGE_LIMIT;
    const { collection = '' } = params;

    return __loadCategoryProducts(collection, page, perPage);
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


const LocalStorageCategoryProductsKey = 'category_products';

type CollectionProducts = {
  [key: string]: Product[];
};

const getCategoryProductsMap = (): CollectionProducts => {
  const item = localStorage.getItem(LocalStorageCategoryProductsKey);
  if (!item) return {};
  return JSON.parse(item);
}

const getCategoryProductFromLocalStorage = (map: CollectionProducts, category: string): Product[] => {
  return map[category] || [];
}

const writeCategoryProductMapToLocalStorage = (map: CollectionProducts) => {
  localStorage.setItem(LocalStorageCategoryProductsKey, JSON.stringify(map));
}

function CollectionList() {
  const { category } = useLoaderData<LoaderType>();

  // "catProdMap" a cached map that won't be used to display but to cache in local storage.
  const catProdMap = useRef<CollectionProducts>({});
  const [productRows, setProductRows] = useState<Product[][]>([]);

  const [hasMore, setHasMore] = useState(true);
  const currPage = useRef(1);

  const fetcher = useFetcher();
  const loadmoreFetcher = useFetcher();
  const transition = useTransition();
  const location = useLocation();

  // When component first mounted, we need to rehydrate product list data if it already exist in local storage.
  // When user switch category tab, this hook will not get trigger which ensures the rehydration only happen once.
  useEffect(() => {
    catProdMap.current = getCategoryProductsMap();
    setProductRows(
      organizeTo9ProdsPerRow(
        getCategoryProductFromLocalStorage(catProdMap.current, category)
      ),
    );

    return () => {
      console.log('unmounting...');
    }
  }, []);

  // For any subsequent change of category, we will try to find that category data in cache first.
  // If it is found, we render it.
  // If category data isn't found in the cache, we'll need to fetch it from server.
  useEffect(() => {
    const cacheMap = catProdMap.current;

    if (cacheMap[category]) {
      setProductRows(
        organizeTo9ProdsPerRow(cacheMap[category])
      )

      return
    }

    currPage.current = 1;

    fetcher.submit(
      {
        __action: 'load_category_products',
        page: currPage.current.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      {
        method: 'post',
        action: `/${category}`
      },
    );
  }, [category]);


  useEffect(() => {
    if (transition.state === 'loading') {
      // writeCategoryProductMapToLocalStorage(catProdMap.current);
    }
  }, [transition.state]);

  useEffect(() => {
    if (fetcher.type === 'done') {
      // Current page fetched successfully, increase page number getting ready to fetch next page.
      const { products } = fetcher.data as ActionType;
      if (products.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      // Update cache only if cache hasn't exists yet
      catProdMap.current[category] = products;

      setProductRows(organizeTo9ProdsPerRow(products));
    }
  }, [fetcher.type])

  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {

      const { products } = loadmoreFetcher.data as ActionType;

      if (products.length <= 0) {
        setHasMore(false);

        return;
      }

      currPage.current += 1;
      catProdMap.current[category] = catProdMap.current[category].concat(products);

      setProductRows(prev => {
        return prev.concat(organizeTo9ProdsPerRow(products))
      });
    }
  }, [loadmoreFetcher.type]);



  const handleLoadMore = () => {
    const pathname = window.location.pathname;
    const category = pathname.substring(pathname.lastIndexOf('/') + 1);

    console.log('debug 2 handleLoadMore', category);
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

  return (
    <div className="prod-list-container">
      <div className="prod-list-breadcrumbs-container">
        <Breadcrumbs breadcrumbs={[
          <NavLink
            className={({ isActive }) => (
              isActive
                ? "breadcrumbs-link breadcrumbs-link-active"
                : "breadcrumbs-link"
            )}
            key='1'
            to={`/${category}`}
          >
            {category}
          </NavLink>,
        ]} />
      </div>

      <ProductRowsContainer
        productRows={productRows}
      />

      <fetcher.Form>
        <input
          type="hidden"
          name="page"
          value={currPage.current}
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
              : <LoadMoreButton
                loading={loadmoreFetcher.state !== 'idle'}
                onClick={handleManualLoad}
                text='Load more'
              />
          }
        </div>
      </fetcher.Form>
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