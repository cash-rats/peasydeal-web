import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { FiShoppingCart } from "react-icons/fi"
import { TbReportSearch, TbSearch } from "react-icons/tb";

import RedDot, { links as RedDotLinks } from '~/components/RedDot';

import styles from './styles/NavBar.css';

export const links: LinksFunction = () => {
	return [
		...RedDotLinks(),
		{ rel: 'stylesheet', href: styles }
	];
};

interface NavBarProps {
	/*
	 * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
	 */
	cartItemCount?: number;

	/*
	 * Open full screen search bar on mobile view. (Only works on mobile view)
	 */
	onClickSearch?: { (evt: MouseEvent<HTMLSpanElement>): void },
}

// Load shopping cart items.
function NavBar({ cartItemCount = 0, onClickSearch = () => { } }: NavBarProps) {
	return (
		<nav className="nav-container">
			<ul className="nav-content-list">
				{/* Search icon that only displays in mobile view */}
				<li className="index_nav-search">
					<span onClick={onClickSearch}>
						<TbSearch fontSize={22} />
					</span>
				</li>

				{/* shopping cart */}
				<li className="nav-content-item">
					{
						cartItemCount > 0 && (
							<RedDot
								dotStyle={{ left: '13px', top: '-1px' }}
								value={cartItemCount}
							/>
						)
					}

					<Link aria-label='shopping cart' to="/cart">
						<FiShoppingCart fontSize={22} />
					</Link>
				</li>

				<li>
					<Link aria-label='track order' to="/tracking">
						<TbReportSearch fontSize={26} />
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
