import { useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs } from 'react-router';
import { json, redirect } from 'react-router';
import httpStatus from 'http-status-codes';
import { useLoaderData } from 'react-router';

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

import checkIsPossibleCategory from '../api/check_is_possible_category.server';

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // We need to do a gaurd clause check to redirect possible old category url `/desks`
    // to new category url `/collection/desks`. If `desks` can not be found fallback
    // to ordinary flow. If `desks` is one of the categories, redirect to proper category url.
    const [isCategoryIntent, categoryName] = await checkIsPossibleCategory(new URL(request.url));

    // If the current request is intended to request category page, but the request has
    // the old category page url pattern, we redirect the request to the newest category
    // url.
    if (isCategoryIntent) {
      return redirect(`/collection/${categoryName}`);
    }

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
    <div className="bg-center bg-cover bg-no-repeat w-full">
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