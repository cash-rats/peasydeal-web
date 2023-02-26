import { useState } from 'react';
import { Form, Outlet, useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node'
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import { fetchCategories } from '~/api/categories.server';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import Footer from '~/components/Footer';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import type { SuggestItem } from '~/shared/types';
import useFetcherWithPromise from '~/routes/hooks/useFetcherWithPromise';
import type { Category } from '~/shared/types';

import { useSearchSuggests } from './hooks/auto-complete-search';

export const links: LinksFunction = () => {
  return [
    ...CategoriesNavLinks(),
    ...HeaderLinks(),
    ...DropDownSearchBarLinks(),
  ];
}

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[]
};

export const loader: LoaderFunction = async () => {
  try {
    const [categories, navBarCategories] = await fetchCategories();

    return json<LoaderType>({
      categories,
      navBarCategories,
    })
  } catch(e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function Payment() {
  const { categories, navBarCategories } = useLoaderData();
  const [suggests, searchSuggests] = useSearchSuggests();
  const search = useFetcher();
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const { submit } = useFetcherWithPromise();

  const handleSearch = (query: string) => {
    search.submit({ query }, { method: 'post', action: '/search?index' });
  }

  const handleOpen = () => setOpenSearchDialog(true);

  const handleClose = () => setOpenSearchDialog(false);

  const handleSearchRequest = async (query: string): Promise<SuggestItem[]> => {
    const data = await submit(
      { query },
      {
        method: 'post',
        action: '/hooks/auto-complete-search?index'
      }
    );

    let suggestItems: SuggestItem[] = [];
    const products: any[] = data.results;

    if (products.length > 0) {
      suggestItems = products.map<SuggestItem>((product) => {
        return {
          title: product.title,
          data: {
            title: product.title,
            image: product.main_pic,
            discount: product.discount,
            productID: product.productUUID,
          },
        };
      });
    }

    return suggestItems;
  }


  return (
    <>
      <Form action='/search?index' method='post'>
        <MobileSearchDialog
          onBack={handleClose}
          isOpen={openSearchDialog}
          onSearchRequest={handleSearchRequest}
          onSearch={handleSearch}
        />
        <Header
          categories={categories}

          mobileSearchBar={
            <SearchBar
              placeholder='Search keywords...'
              onClick={handleOpen}
            />
          }

          categoriesBar={
            <CategoriesNav
              categories={categories}
              topCategories={navBarCategories}
            />
          }

          searchBar={
            <DropDownSearchBar
              form='index-search-product'
              placeholder='Search products by name'
              onDropdownSearch={searchSuggests}
              results={suggests}
              onSearch={handleSearch}
            />
          }
        />
      </Form>

      <div className="min-h-[35rem] flex justify-center">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}