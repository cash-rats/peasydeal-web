import { useState } from 'react';
import type { LinksFunction } from 'react-router';
import { Outlet, useLoaderData, useRouteLoaderData } from 'react-router';
import httpStatus from 'http-status-codes';

import type { Category } from '~/shared/types';
import Header, { links as HeaderLinks } from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import SearchBar from '~/components/SearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

type LoaderData = {
  categories: Category[];
  navBarCategories: Category[];
};

export const links: LinksFunction = () => [
  ...HeaderLinks(),
  ...FooterLinks(),
  ...CategoriesNavLinks(),
  ...DropDownSearchBarLinks(),
];

export const loader = async () => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
    });
  } catch (e) {
    console.error(e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export default function PromotionLayout() {
  const { categories, navBarCategories } = useLoaderData<LoaderData>() || {};
  const rootData = useRouteLoaderData('root') as { cartCount?: number } | undefined;
  const cartCount = rootData?.cartCount ?? 0;
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  const handleOpen = () => setOpenSearchDialog(true);
  const handleClose = () => setOpenSearchDialog(false);

  return (
    <div>
      <MobileSearchDialog onBack={handleClose} isOpen={openSearchDialog} />

      <Header
        categories={categories}
        numOfItemsInCart={cartCount}
        categoriesBar={<CategoriesNav categories={categories} topCategories={navBarCategories} />}
        mobileSearchBar={<SearchBar placeholder='Search keywords...' onClick={handleOpen} onTouchEnd={handleOpen} />}
        searchBar={<DropDownSearchBar />}
      />

      <main className="bg-white min-h-[35rem]">
        <Outlet />
      </main>

      <Footer categories={categories} />
    </div>
  );
}
