import { useState, type ReactNode } from 'react';
import type { LinksFunction } from 'react-router';

import type { Category } from '~/shared/types';
import Header from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import CategoriesNav from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import SearchBar from '~/components/SearchBar';

type CatalogLayoutProps = {
  categories: Category[];
  navBarCategories: Category[];
  cartCount?: number;
  children: ReactNode;
};

export const links: LinksFunction = () => [
  ...FooterLinks(),
  ...DropDownSearchBarLinks(),
];

export default function CatalogLayout({
  categories,
  navBarCategories,
  cartCount = 0,
  children,
}: CatalogLayoutProps) {
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

      <main className="min-h-[35rem]">{children}</main>

      <Footer categories={categories} />
    </div>
  );
}
