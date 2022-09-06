import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { BiUserCircle } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi"

import RedDot, { links as RedDotLinks } from '~/components/RedDot';

import styles from './styles/NavBar.css';

export const links: LinksFunction = () => {
	return [
		...RedDotLinks(),
		{ rel: 'stylesheet', href: styles }
	];
};

export const loader: LoaderFunction = () => {
};

// Load shopping cart items.
function NavBar() {
	return (
		<nav className="nav-container">
			<ul className="nav-content-list">
				<li className="nav-content-item">
					<BiUserCircle fontSize={25} />
				</li>

				<li className="nav-content-item">
					<MdFavorite fontSize={25} />
				</li>

				{/* shopping cart */}
				<li className="nav-content-item">
					<RedDot
						dotStyle={{ left: '23px', top: '-3px' }}
						value={100}
					/>

					<Link to="/cart">
						<FiShoppingCart fontSize={25} />
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
