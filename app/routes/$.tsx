import { useState } from 'react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import httpStatus from 'http-status-codes';
import { useLoaderData, useFetcher, Form } from '@remix-run/react';

import SearchBar from '~/components/SearchBar';
import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import type { Category } from '~/shared/types';
import { fetchCategories } from '~/api/categories.server';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import type { SuggestItem } from '~/shared/types';
import useFetcherWithPromise from '~/routes/hooks/useFetcherWithPromise';

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[]
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
  try {
    const [categories, navBarCategories] = await fetchCategories();

    return json<LoaderType>({
      categories,
      navBarCategories,
    });
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

function GlobalSplatFourOhFour() {
  const { categories, navBarCategories } = useLoaderData<LoaderType>();
  const [suggests, searchSuggests] = useSearchSuggests();
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const search = useFetcher();
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
    <div className="pt-48 bg-center bg-cover bg-no-repeat bg-home-gradient-light-sm md:pt-40 md:bg-home-gradient-light">
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
            placeholder='Search products by name'
            onDropdownSearch={searchSuggests}
            results={suggests}
            onSearch={handleSearch}
          />
        }
      />
      <FourOhFour />

      <Footer />
    </div>
  );
};

export default GlobalSplatFourOhFour;