import { Form, Outlet, useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node'
import type { LoaderFunction, LinksFunction } from '@remix-run/node';

import { fetchCategories } from '~/api/categories.server';
import CategoryContext from '~/context/categories';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import Footer from '~/components/Footer';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';

import { useSearchSuggests } from './hooks/auto-complete-search';

export const links: LinksFunction = () => {
  return [
    ...CategoriesNavLinks(),
    ...HeaderLinks(),
    ...DropDownSearchBarLinks(),
  ];
}

export const loader: LoaderFunction = async () => {
  const categories = await fetchCategories();
  return json({ categories })
}

export default function Payment() {
  const { categories } = useLoaderData();
  const [suggests, searchSuggests] = useSearchSuggests();
  const search = useFetcher();

  const handleSearch = (query: string) => {
    search.submit({ query }, { method: 'post', action: '/search' });
  }

  return (
    <>
      <CategoryContext.Provider value={categories}>
        <Form action='/search'>
          <Header
            categoriesBar={<CategoriesNav categories={categories} />}
            searchBar={
              <DropDownSearchBar
                form='index-search-product'
                placeholder='Search products by name'
                onDropdownSearch={searchSuggests}
                results={suggests}
                onSearch={handleSearch}
              />
            }
            onSearch={handleSearch}
          />
        </Form>
      </CategoryContext.Provider>

      <div className="pt-[144px] min-h-[35rem] flex justify-center">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}