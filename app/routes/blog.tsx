import { useState } from 'react';
import { Outlet } from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';

import HorizontalProductsLayout, { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import SearchBar from '~/components/SearchBar';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import {
  getCartTitleText,
  getCanonicalDomain,
  getCartFBSEO_V2,
} from '~/utils/seo';

import cartStyles from './styles/cart.css';

export const meta: V2_MetaFunction = () => {
  return [
    { title: getCartTitleText() },
    ...getCartFBSEO_V2(),
  ]
}

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
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const handleOpen = () => setOpenSearchDialog(true);

  const handleClose = () => setOpenSearchDialog(false);

  return (
    <div>
      <MobileSearchDialog
        onBack={handleClose}
        isOpen={openSearchDialog}
      />

      <Header
        categories={categories}
        hidePropBar
        mobileSearchBar={
          <SearchBar
            placeholder='Search keywords...'
            onClick={handleOpen}
          />
        }

        searchBar={
          <DropDownSearchBar />
        }
        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }
      />

      <main className='bg-white'>
        <Outlet />
      </main>

      <Footer categories={categories} />
    </div>
  );
}

export default CartLayout;