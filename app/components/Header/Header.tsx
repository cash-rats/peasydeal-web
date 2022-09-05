import type { LinksFunction } from "@remix-run/node";
import { Link } from '@remix-run/react';
import { AiOutlineMail, AiOutlinePhone, AiFillHeart } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi"

import SearchBar from "./SearchBar";
import CategoriesNav from "./CategoriesNav";
import type { Category } from "./CategoriesNav";
import styles from "./styles/Header.css";
import NavBar, { links as NavBarLinks } from './components/NavBar';

export const links: LinksFunction = () => {
	return [
		...NavBarLinks(),
		{rel: 'stylesheet', href: styles},
	];
};

interface HeaderProps {
	categories?: Category[];
};

export default function Header({ categories = [] }: HeaderProps) {
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

				<NavBar />
			</div>

			<div className="category-nav-container">
				<CategoriesNav categories={categories} />
			</div>
		</div>
	);
}
