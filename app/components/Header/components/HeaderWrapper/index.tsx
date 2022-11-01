import type { ReactNode, CSSProperties } from 'react';
import type { LinksFunction } from "@remix-run/node";

import styles from "./styles/HeaderWrapper.css";

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
};

interface HeaderProps {
	children: ReactNode;

	categoryBar?: ReactNode;

	style?: CSSProperties | undefined;
};

export default function HeaderWrapper({ children, categoryBar, style }: HeaderProps) {
	return (
		<>
			<header style={style} className="header-container">
				<div className="header-content-container">
					<div className="header-wrapper_top">
						{children}
					</div>
				</div>

				{
					categoryBar && (
						<div className="header-wrapper_category-bar">
							{categoryBar}
						</div>
					)
				}

			</header>
		</>
	);
}