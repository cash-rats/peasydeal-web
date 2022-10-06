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

	categoryBar?: ReactElement;
};

export default function HeaderWrapper({ children, categoryBar }: HeaderProps) {
	return (
		<header className="header-container">
			<div className="header-content-container">
				<div className="header-wrapper_top">

					{children}
				</div>

				{
					categoryBar && (
						<div className="header-wrapper_category-bar">
							{categoryBar}
						</div>
					)
				}
			</div>

		</header>
	);
}