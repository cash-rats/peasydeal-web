import type { LinksFunction } from '@remix-run/node';

import HeaderWrapper, { links as HeaderLinks } from "./Header";
import type { Category } from './components/CategoriesNav';
import LogoBar, { links as LogoBarLinks } from './components/LogoBar';
import SearchBar, { links as SearchBarLinks } from './components/SearchBar';
import NavBar from './components/NavBar';

export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
    ...LogoBarLinks(),
    ...SearchBarLinks(),
  ];
};

interface HeaderProps {
  categories?: Category[];
}

function Header({ categories }: HeaderProps) {
  return (
    <HeaderWrapper categories={categories}>
      <LogoBar />
      <SearchBar />
      <NavBar />
    </HeaderWrapper>
  );
};

export default Header;
