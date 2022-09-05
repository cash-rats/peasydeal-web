import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { BiUserCircle } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi"

import styles from './styles/NavBar.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles }
	];
};


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
					<Link to="/cart">
						<FiShoppingCart fontSize={25} />
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
