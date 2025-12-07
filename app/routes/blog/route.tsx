import { useState } from 'react';
import {
  type LinksFunction,
  type MetaFunction,
  Outlet,
  useRouteLoaderData,
} from 'react-router';

import MobileSearchDialog from '~/components/MobileSearchDialog';
import SearchBar from '~/components/SearchBar';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import CategoriesNav from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useCartCount } from '~/routes/hooks';
import type { RootLoaderData } from '~/root';

import {
  getBlogTitleText,
  getBlogFBSEO_V2,
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
    ...DropDownSearchBarLinks(),
  ];
};

function BlogLayout() {
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const cartCount = useCartCount();
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
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
        numOfItemsInCart={cartCount}
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
