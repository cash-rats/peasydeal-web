import { useState } from 'react';
import { Outlet } from "@remix-run/react";
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';

import HorizontalProductsLayout, { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';
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
      rel: 'canonical', href: data?.canonicalLink,
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
    ...HorizontalProductsLayoutLinks(),
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
  const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
  const [suggests, searchSuggests] = useSearchSuggests();
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const search = useFetcher();
  const handleSearch = (query: string) => {
    window.rudderanalytics?.track('search_action_click', {
      query,
    });
    search.submit({ query }, { method: 'post', action: '/search?index' });
  }

  const handleOpen = () => setOpenSearchDialog(true);

  const handleClose = () => setOpenSearchDialog(false);

  const { submit } = useFetcherWithPromise();

  const handleSearchRequest = async (query: string): Promise<SuggestItem[]> => {
    window.rudderanalytics?.track('search_auto_complete', {
      query,
      layout: 'mobile',
    });

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

      <section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				px-2 md:px-4
				bg-white
			">
        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          {/* Recommended products - top items */}
          {/* @TODO catID should not be hardcoded here */}
          <HorizontalProductsLayout
            catName='hot_deal'
            title='top items'
            seeAllLinkTo='/promotion/hot_deal'
          />

          {/* Recommended products - new trend */}
          {/* @TODO catID should not be hardcoded here */}
          <HorizontalProductsLayout
            catName='new_trend'
            title='new trend'
            seeAllLinkTo='/promotion/new_trend'
          />
        </div>
      </section>
      <Footer categories={categories} />
    </div>
  );
}

export default CartLayout;