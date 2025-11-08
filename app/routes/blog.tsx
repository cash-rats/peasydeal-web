import { useState } from 'react';
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  Outlet,
  useLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';

import { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import SearchBar from '~/components/SearchBar';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';

import {
  getBlogTitleText,
  getBlogFBSEO_V2
} from '~/utils/seo';

export const meta: MetaFunction = () => {
  return [
    {
      title: getBlogTitleText(),
    },
    ...getBlogFBSEO_V2(),
  ]
}

export const links: LinksFunction = () => {
  return [
    ...CategoriesNavLinks(),
    ...HeaderLinks(),
    ...FooterLinks(),
    ...DropDownSearchBarLinks(),
    ...HorizontalProductsLayoutLinks(),
  ];
};

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
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
}

function BlogLayout() {
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

export default BlogLayout;
