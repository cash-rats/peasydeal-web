import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher, Form } from '@remix-run/react';

import CategoryContext from '~/context/categories';
import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';
import Header, { links as HeaderLinks } from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import type { Category } from '~/shared/types';
import { fetchCategories } from '~/api/categories.server';
import { getItemCount } from '~/sessions/shoppingcart.session';

type LoaderDataType = {
  categories: Category[];
  numOfItemsInCart: number;
};

export const links: LinksFunction = () => {
  return [
    ...FourOhFourLinks(),
    ...HeaderLinks(),
    ...FooterLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const cats = await fetchCategories();
  const numOfItemsInCart = await getItemCount(request);
  return json<LoaderDataType>({ categories: cats, numOfItemsInCart });
}

function GlobalSplatFourOhFour() {
  const { categories, numOfItemsInCart } = useLoaderData<LoaderDataType>();
  const [suggests, searchSuggests] = useSearchSuggests();
  const search = useFetcher();
  const handleSearch = (query: string) => {
    search.submit({ query }, { method: 'post', action: '/search' });
  }

  return (
    <div className="pt-48 bg-center bg-cover bg-no-repeat bg-home-gradient-light-sm md:pt-40 md:bg-home-gradient-light">
      <CategoryContext.Provider value={categories}>
        <Form action='/search'>
          <Header
            categoriesBar={
              <CategoriesNav categories={categories} />
            }

            searchBar={
              <DropDownSearchBar
                placeholder='Search products by name'
                onDropdownSearch={searchSuggests}
                results={suggests}
                onSearch={handleSearch}
              />
            }
            numOfItemsInCart={numOfItemsInCart}
            onSearch={handleSearch}
          />
        </Form>
      </CategoryContext.Provider>

      <FourOhFour />

      <Footer />
    </div>
  );
};

export default GlobalSplatFourOhFour;