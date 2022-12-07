import { Outlet } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Form, useFetcher } from '@remix-run/react';

import CategoryContext from '~/context/categories';
import { getItemCount } from '~/utils/shoppingcart.session';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { fetchCategories } from '~/categories.server';
import type { Category } from '~/shared/types';

import styles from './styles/index.css';

type LoaderType = {
  cartItemCount: number;
  categories: Category[];

};

export const loader: LoaderFunction = async ({ request }) => {
  const categories = await fetchCategories();
  const cartItemCount = await getItemCount(request);

  return json<LoaderType>({ cartItemCount, categories });
}

export const links: LinksFunction = () => {
  return [
    ...CategoriesNavLinks(),
    ...HeaderLinks(),
    ...FooterLinks(),
    ...DropDownSearchBarLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

function CartLayout() {
  const { cartItemCount, categories } = useLoaderData<LoaderType>();
  const [suggests, searchSuggests] = useSearchSuggests();

  const search = useFetcher();
  const handleSearch = (query: string) => {
    search.submit({ query }, { method: 'post', action: '/search' });
  }

  return (
    <>
      <CategoryContext.Provider value={categories}>
        <Form action='/search' >
          <Header
            form='cart-search-products'
            numOfItemsInCart={cartItemCount}
            searchBar={
              <DropDownSearchBar
                form='cart-search-products'
                placeholder='Search products by name'
                onDropdownSearch={searchSuggests}
                results={suggests}
                onSearch={handleSearch}
              />
            }
            onSearch={handleSearch}
            categoriesBar={<CategoriesNav categories={categories} />}
          />
        </Form>
      </CategoryContext.Provider>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default CartLayout;