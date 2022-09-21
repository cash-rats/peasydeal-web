import type { ReactElement } from 'react';
import type { LinksFunction } from "@remix-run/node";

import CategoriesNav, { links as CategoriesNavLinks } from "./components/CategoriesNav";
import type { Category } from "./components/CategoriesNav";
import styles from "./styles/HeaderWrapper.css";

export const links: LinksFunction = () => {
	return [
		...CategoriesNavLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

interface HeaderProps {
	children: ReactElement | ReactElement[];

	categoryBar?: ReactElement | null;
};

export default function HeaderWrapper({ children, categoryBar }: HeaderProps) {
	return (
		<div className="header-container">
			<div className="header-content-container">
				{children}
			</div>

			{categoryBar && (categoryBar)}
		</div>
	);
}