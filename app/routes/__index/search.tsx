import { useEffect, useRef, useState } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import httpStatus from 'http-status-codes';
import { useCatch, useLoaderData, useFetcher } from '@remix-run/react';

import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';
import LoadMore, { links as LoadMoreLinks } from '~/components/LoadMore';
import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import LoadMoreButton from '~/components/LoadMoreButton';
import PageTitle from '~/components/PageTitle';

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { searchProducts } from './api';
import productListStyles from './styles/ProductList.css';
import searchStyles from './styles/Search.css';

export const links: LinksFunction = () => {
  return [
    ...LoadMoreLinks(),
    ...ProductRowsContainerLinks(),
    ...CssSpinnerLinks(),
    { rel: 'stylesheet', href: productListStyles },
    { rel: 'stylesheet', href: searchStyles },
  ];
};

type LoaderType = {
  products: Product[];
  query: string;
  page: number;
  has_more: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("query");
  const page = Number(url.searchParams.get('page')) || 1;

  if (!search) {
    throw json('no query provided', httpStatus.BAD_REQUEST);
  }

  const products = await searchProducts({
    query: search,
    perpage: PAGE_LIMIT,
    page,
  })

  if (products.length === 0) {
    throw json({ query: search }, httpStatus.NOT_FOUND);
  }

  return json<LoaderType>({
    products,
    query: search,
    page,
    has_more: products.length === PAGE_LIMIT,
  });
}


export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  return redirect(`/search?query=${formObj['query']}`);
}

// TODO: more design
export const CatchBoundary = () => {
  const caught = useCatch();
  if (caught.status === httpStatus.NOT_FOUND) {
    return (
      <div className="Search__notfound-warpper">
        <div className="Search__notfound-content">
          <p className="Search__notfound-text">
            No product found for: {caught.data.query}
          </p>

          <p className="Search__notfound-text">
            Please try search again, check your key word or try another word.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      some error
    </div>
  )
}

// TODOs:
//   - Need to add breadcrumbs navigation bar.
//   - No result page.
export default function Search() {
  const loaderData = useLoaderData<LoaderType>();

  const currPageRef = useRef(loaderData.page);
  const loadMoreFetcher = useFetcher();
  const [products, setProducts] = useState<Product[]>(loaderData.products);
  const [hasMore, setHasMore] = useState(loaderData.has_more);


  // Update product rows when user searches different item. When user stays on `/search` page and searches again,
  // the component does not get rerendered (since we stay on the same page). Thus, we need to update product_rows
  // state when we get new search results from loader.
  useEffect(() => {
    setProducts(products)
  }, [products]);

  useEffect(() => {
    if (loadMoreFetcher.type === 'done') {
      const { products, has_more } = loadMoreFetcher.data as LoaderType;

      if (products.length > 0) {
        currPageRef.current += 1;
      }

      setHasMore(has_more);

      setProducts(prev => prev.concat(products));
    }
  }, [loadMoreFetcher]);

  const handleClickProduct = () => {
    console.log('handleClickProduct');
  };

  const handleLoadMore = () => {
    const nextPage = currPageRef.current + 1;

    loadMoreFetcher.submit(
      {
        query: loaderData.query,
        page: nextPage.toString()
      },
      { action: '/search' }
    );
  };

  const handleManualLoad = () => {
    loadMoreFetcher.load(`/?index&page=${currPageRef.current}&per_page=${PAGE_LIMIT}`);
  }

  return (
    <div className="my-0 mx-auto w-full flex flex-col justify-center flex-wrap items-center">
      <PageTitle
        title={`Search results for "${loaderData.query}"`}
      />

      <div className="pt-8">
        <ProductRowsContainer
          products={products}
          onClickProduct={handleClickProduct}
        />
      </div>

      <loadMoreFetcher.Form>
        <div className="ProductList__loadmore-container">
          {
            hasMore
              ? (
                <LoadMore
                  spinner={<CssSpinner scheme='spinner' />}
                  loading={loadMoreFetcher.state !== 'idle'}
                  callback={handleLoadMore}
                  delay={100}
                  offset={150}
                />
              )
              : <LoadMoreButton
                loading={loadMoreFetcher.state !== 'idle'}
                onClick={handleManualLoad}
                text='Load more'
              />
          }
        </div>
      </loadMoreFetcher.Form>
    </div>
  )
}