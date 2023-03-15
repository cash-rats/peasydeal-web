import { useState } from 'react';
import { Outlet } from "@remix-run/react";
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';

import type { SuggestItem } from '~/shared/types';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import SearchBar from '~/components/SearchBar';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import {
  getCartTitleText,
  getCanonicalDomain,
  getCartFBSEO,
} from '~/utils/seo';
import useFetcherWithPromise from '~/routes/hooks/useFetcherWithPromise';

import cartStyles from './styles/cart.css';

export const meta: MetaFunction = () => ({
  title: getCartTitleText(),

  ...getCartFBSEO(),
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
  categories: Category[];
  navBarCategories: Category[];
  canonicalLink: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return json<LoaderType>({
      categories,
      navBarCategories,
      canonicalLink: `${getCanonicalDomain()}/cart`
    });
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

function CartLayout() {
  const { categories, navBarCategories } = useLoaderData<LoaderType>();
  const [suggests, searchSuggests] = useSearchSuggests();
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const search = useFetcher();
  const handleSearch = (query: string) => {
    search.submit({ query }, { method: 'post', action: '/search?index' });
  }

  const handleOpen = () => setOpenSearchDialog(true);

  const handleClose = () => setOpenSearchDialog(false);
  const { submit } = useFetcherWithPromise();

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
    <div>
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

        searchBar={
          <DropDownSearchBar
            placeholder='Search products by name'
            onDropdownSearch={searchSuggests}
            results={suggests}
            onSearch={handleSearch}
          />
        }
        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }
      />

      <main>
        <Outlet />
      </main>

      <Footer categories={categories} />
    </div>
  );
}

export default CartLayout;