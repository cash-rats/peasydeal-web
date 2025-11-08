import { useState } from 'react';
import { Outlet } from "react-router";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from 'react-router';
import { useLoaderData } from 'react-router';

import httpStatus from 'http-status-codes';
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

import cartStyles from './styles/cart.css?url';

export const meta: MetaFunction = () => {
  return [
    { title: getCartTitleText() },
    ...getCartFBSEO_V2(),
    { tagName: 'link', rel: 'canonical', href: `${getCanonicalDomain()}/cart` },
  ]
}

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

export const loader = async ({ request }: Parameters<LoaderFunction>[0]) => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
      canonicalLink: `${getCanonicalDomain()}/cart`
    });
  } catch (e) {
    console.error('cart error', e);

    throw Response.json(e, {
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
        mobileSearchBar={
          <SearchBar
            placeholder='Search keywords...'
            onClick={handleOpen}
            onTouchEnd={handleOpen}
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

      <main>
        <Outlet />
      </main>

      <section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				px-2 md:px-4
				bg-white
        mt-4
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
