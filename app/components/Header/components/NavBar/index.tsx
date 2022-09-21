import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { FiShoppingCart } from "react-icons/fi"

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
}

// Load shopping cart items.
function NavBar({ cartItemCount = 0 }: NavBarProps) {
	return (
		<nav className="nav-container">
			<ul className="nav-content-list">
				{/* shopping cart */}
				<li className="nav-content-item">
					{
						cartItemCount > 0 && (
							<RedDot
								dotStyle={{ left: '19px', top: '-3px' }}
								value={cartItemCount}
							/>
						)
					}

					<Link to="/cart">
						<FiShoppingCart fontSize={25} />
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
