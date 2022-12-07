import { useEffect, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { LinksFunction } from "@remix-run/node";
import clsx from 'clsx';

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
	const [enableBgColor, setEnableBgColor] = useState(false);

	useEffect(() => {
		const handleScroll = (evt: Event) => {
			const windowDOM = window as Window;
			setEnableBgColor(windowDOM.scrollY > 0);
		}

		if (!window) return;
		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll)
	}, []);

	return (
		<>
			<header style={style} className="header-container">
				<div className={clsx("header-content-container", {
					"HeaderWrapp__header-content-container-scrolled": enableBgColor,
				})}>
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