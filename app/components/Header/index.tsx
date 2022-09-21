import type { LinksFunction } from '@remix-run/node';

import HeaderWrapper, { links as HeaderLinks } from "./HeaderWrapper";
import type { Category } from './components/CategoriesNav';
import LogoBar, { links as LogoBarLinks } from './components/LogoBar';
import SearchBar, { links as SearchBarLinks } from './components/SearchBar';
import NavBar, { links as NavBarLinks } from './components/NavBar';
import CategoriesNav, { links as CategoriesNavLinks } from './components/CategoriesNav';

import styles from './styles/HeaderWrapper.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    ...HeaderLinks(),
    ...LogoBarLinks(),
    ...SearchBarLinks(),
    ...NavBarLinks(),
    ...CategoriesNavLinks(),
  ];
};

interface HeaderProps {
  categories?: Category[];

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  cartItemCount?: number;
}

function Header({ categories, cartItemCount = 0 }: HeaderProps) {
  return (
    <HeaderWrapper
      categoryBar={
        <CategoriesNav categories={categories} />
      }
    >
      <LogoBar />
      <SearchBar />
      <NavBar cartItemCount={cartItemCount} />
    </HeaderWrapper>
  );
};

export default Header;
