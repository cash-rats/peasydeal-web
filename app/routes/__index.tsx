import { useState } from 'react';
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import LogoHeader, { links as LogoHeaderLinks } from '~/components/Header/components/LogoHeader';
import NavBar, { links as NavBarLinks } from '~/components/Header/components/NavBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import { getSession } from '~/sessions';
import type { SessionKey } from '~/sessions';

import styles from "./styles/index.css";
import { fetchCategories } from './api';

export const links: LinksFunction = () => {
	return [
		...FooterLinks(),
		...LogoHeaderLinks(),
		...NavBarLinks(),
		...DropDownSearchBarLinks(),
		...CategoriesNavLinks(),

		{ rel: 'stylesheet', href: styles }
	];
};

type ContextType = { categories: Category[] };

export const loader: LoaderFunction = async ({ request }) => {
	// Fetch categories.
	const categories = await fetchCategories();

	// - Count number of items in shopping cart from session if not logged in yet.
	// - Retrieve this information from API if user is logged in.
	const sessionKey: SessionKey = 'shopping_cart';
	const session = await getSession(
		request.headers.get('Cookie'),
	);

	let cartItems = {};

	if (session.has(sessionKey)) {
		cartItems = session.get(sessionKey);
	}

	const numOfItemsInCart = Object.keys(cartItems).length

	return json({
		numOfItemsInCart,
		categories: categories.cats,
	}, {
		status: StatusCodes.OK,
	});
};

// export const action: ActionFunction = ({ request }) => {
// 	console.log('debug action');

// 	return null;
// }

export default function Index() {
	const { numOfItemsInCart, categories } = useLoaderData();
	const [results, setResults] = useState([]);

	const handleDropdownSearch = () => {
		console.log('trigger handleDropdownSearch');
	};

	return (
		<>
			<LogoHeader
				categoriesBar={<CategoriesNav categories={categories} />}
			>

				<div className="index_header-content">

					{/* search bar */}
					<div className="index_search-bar">
						<DropDownSearchBar
							placeholder="search product"
							onDropdownSearch={handleDropdownSearch}
							results={results}
						/>
					</div>

					{/* right status bar, cart, search icon...etc */}
					<div className="index_nav-bar">
						<div className="index_nav-bar-wrapper">
							<NavBar cartItemCount={numOfItemsInCart} />
						</div>
					</div>
				</div>
			</LogoHeader>

			<main className="main-container">
				<Outlet context={{ categories: categories }} />
			</main>

			<Footer />
		</>
	);
}

export function useContext() {
	return useOutletContext<ContextType>();
};
