import { Outlet } from "@remix-run/react";
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Form, useFetcher } from '@remix-run/react';
import type { DynamicLinksFunction } from 'remix-utils';

import CategoryContext from '~/context/categories';
import { getItemCount } from '~/sessions/shoppingcart.session';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { fetchCategories } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import {
  getCartTitleText,
  getCanonicalDomain,
  getCartFBSEO,
} from '~/utils/seo';

import cartStyles from './styles/cart.css';

export const meta: MetaFunction = () => ({
  title: getCartTitleText(),

  ...getCartFBSEO(getCartTitleText()),
});

const dynamicLinks: DynamicLinksFunction<LoaderType> = ({ data }) => {
  return [
    {
      rel: 'canonical', href: data.canonicalLink,
    },
  ];
}
export const handle = { dynamicLinks };

export const links: LinksFunction = () => {
  return [
    ...CategoriesNavLinks(),
    ...HeaderLinks(),
    ...FooterLinks(),
    ...DropDownSearchBarLinks(),
    { rel: 'stylesheet', href: cartStyles },
  ];
};

type LoaderType = {
  cartItemCount: number;
  categories: Category[];
  canonicalLink: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const categories = await fetchCategories();
  const cartItemCount = await getItemCount(request);

  return json<LoaderType>({
    cartItemCount,
    categories,
    canonicalLink: `${getCanonicalDomain()}/cart`
  });
}


function CartLayout() {
  const { cartItemCount, categories } = useLoaderData<LoaderType>();
  const [suggests, searchSuggests] = useSearchSuggests();

  const search = useFetcher();
  const handleSearch = (query: string) => {
    search.submit({ query }, { method: 'post', action: '/search' });
  }

  return (
    <div className="pt-28 540:pt-36 md:pt-[8rem]">
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
    </div>
  );
}

export default CartLayout;