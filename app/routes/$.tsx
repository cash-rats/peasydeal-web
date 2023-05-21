import { useState } from 'react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import httpStatus from 'http-status-codes';
import { useLoaderData } from '@remix-run/react';

import SearchBar from '~/components/SearchBar';
import FourOhFour from '~/components/FourOhFour';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import type { Category } from '~/shared/types';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import CategoriesRow from "~/components/CategoriesRow";

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[]
};

export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
    ...FooterLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

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
  const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const handleOpen = () => setOpenSearchDialog(true);

  const handleClose = () => setOpenSearchDialog(false);


  return (
    <div className="bg-center bg-cover bg-no-repeat bg-home-gradient-light-sm md:bg-home-gradient-light w-full">
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

      <FourOhFour />

      <CategoriesRow defatulCategories={{ categories }} />

      <Footer />
    </div>
  );
};

export default GlobalSplatFourOhFour;