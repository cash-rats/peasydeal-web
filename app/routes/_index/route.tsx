import { useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import {
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[];
};

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
  ];
};

export const loader = async (_args: LoaderFunctionArgs) => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
    return Response.json({
      categories,
      navBarCategories,
    });
  } catch (e) {
    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export default function LandingPage() {
  const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
  const rootData = useRouteLoaderData("root") as { cartCount?: number } | undefined;
  const cartCount = rootData?.cartCount ?? 0;
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const handleOpen = () => setOpenSearchDialog(true);
  const handleClose = () => setOpenSearchDialog(false);

  return (
    <>
      <div className="bg-white w-full">
        index page
      </div>

      <Header
        categories={categories}
        numOfItemsInCart={cartCount}
        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }
        mobileSearchBar={
          <SearchBar
            placeholder='Search keywords...'
            onClick={handleOpen}
            onTouchEnd={handleOpen}
          />
        }
        searchBar={<DropDownSearchBar />}
      />

      <main className="min-h-[35rem]">
        hello outlet
      </main>

      <Footer categories={categories} />

      <MobileSearchDialog
        isOpen={openSearchDialog}
        onBack={handleClose}
      />
    </>
  );
}
