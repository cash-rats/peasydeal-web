import { ReactElement } from 'react';
import type { LinksFunction } from "@remix-run/node";

import CategoriesNav, { links as CategoriesNavLinks } from "./components/CategoriesNav";
import type { Category } from "./components/CategoriesNav";
import SearchBar, { links as SearchBarLinks } from "./components/SearchBar";
import NavBar, { links as NavBarLinks } from './components/NavBar';
import LogoBar, { links as LogoBarlInks } from './components/LogoBar';
import styles from "./styles/Header.css";

export const links: LinksFunction = () => {
	return [
		...LogoBarlInks(),
		...CategoriesNavLinks(),
		...SearchBarLinks(),
		...NavBarLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

interface HeaderProps {
	categories?: Category[];

	/*
	 * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
	 */
	cartItemCount?: number;

	children: ReactElement | ReactElement[];
};

export default function Header({
	categories = [],
	cartItemCount = 0,
	children,
}: HeaderProps) {
	return (
		<div className="header-container">
			<div className="header-content-container">
				{children}
				{/* <LogoBar />

				<div className="searchbar-container">
					<SearchBar />
				</div>

				<NavBar cartItemCount={cartItemCount} /> */}
			</div>

			<div className="category-nav-container">
				<CategoriesNav categories={categories} />
			</div>
		</div>
	);
}
