import { useState } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import type { LinksFunction, MetaFunction } from 'react-router';
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import Header, { links as HeaderLinks } from '~/routes/Header/route';
import Footer from '~/components/Footer';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import type { Category } from '~/shared/types';
import { getPaymentSuccessTitleText } from '~/utils/seo';

export const links: LinksFunction = () => {
  return [
    ...CategoriesNavLinks(),
    ...HeaderLinks(),
    ...DropDownSearchBarLinks(),
  ];
}

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[]
};

export const meta: MetaFunction = () => ([
  { title: getPaymentSuccessTitleText() },
]);

export const loader = async () => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
    })
  } catch (e) {
    console.error(e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function Payment() {
  const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const handleOpen = () => setOpenSearchDialog(true);

  const handleClose = () => setOpenSearchDialog(false);

  return (
    <>
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
          />
        }

        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }

        searchBar={<DropDownSearchBar />}
      />

      <div className="min-h-[35rem] flex justify-center">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}
