import type { LinksFunction } from "@remix-run/node";
import { AiOutlineMail, AiOutlinePhone, AiFillHeart } from "react-icons/ai";

import CategoriesNav, { links as CategoriesNavLinks } from "./components/CategoriesNav";
import type { Category } from "./components/CategoriesNav";
import SearchBar, { links as SearchBarLinks } from "./components/SearchBar";
import NavBar, { links as NavBarLinks } from './components/NavBar';
import styles from "./styles/Header.css";

export const links: LinksFunction = () => {
	return [
		...CategoriesNavLinks(),
		...SearchBarLinks(),
		...NavBarLinks(),
		{rel: 'stylesheet', href: styles},
	];
};

interface HeaderProps {
	categories?: Category[];

	/*
	 * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
	 */
	cartItemCount?: number;
};

export default function Header({ categories = [],  cartItemCount = 0 }: HeaderProps) {
	return (
		<div className="header-container">
			{/* Contact */}
			<div className="contact-container">
				<div className="contact-content">
					<span>
						<AiOutlinePhone />
					</span>

					<i>
						(00)0000-0000
					</i>
				</div>

				<div className="contact-content">
					<span>
						<AiOutlineMail />
					</span>

					<i>
						email@email.com
					</i>
				</div>
			</div>

			<div className="header-content-container">
				<div className="logo">
					<AiFillHeart fontSize={45} color="#555BBD" />
				</div>

				<div className="searchbar-container">
					<SearchBar />
				</div>

				<NavBar cartItemCount={cartItemCount} />
			</div>

			<div className="category-nav-container">
				<CategoriesNav categories={categories} />
			</div>
		</div>
	);
}
