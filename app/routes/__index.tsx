import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import Header, { links as HeaderLinks } from '~/components/Header';
import { getSession } from '~/sessions';
import type { SessionKey } from '~/sessions';

import styles from "./styles/index.css";
import { fetchCategories } from './api';

export const links: LinksFunction = () => {
	return [
		...HeaderLinks(),
		{ rel: 'stylesheet', href: styles }
	];
};

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

export default function Index() {
	const { numOfItemsInCart, categories } = useLoaderData();

	return (
		<>
			<Header
				cartItemCount={numOfItemsInCart}
				categories={categories}
			/>

			<main className="main-container">
				<Outlet />
			</main>
		</>
	);
}

