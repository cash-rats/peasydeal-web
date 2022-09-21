import type { ReactElement } from 'react';
import type { LinksFunction } from "@remix-run/node";

import styles from "./styles/HeaderWrapper.css";

export const links: LinksFunction = () => {
	return [
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