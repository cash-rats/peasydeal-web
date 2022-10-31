import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
	Outlet,
	useLoaderData,
	useOutletContext,
	Form,
	useFetcher,
} from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import CategoryContext from '~/context/categories';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { getItemCount } from '~/utils/shoppingcart.session';

import styles from "./styles/index.css";
import { fetchCategories } from './api';


export const links: LinksFunction = () => {
	return [
		...FooterLinks(),
		...HeaderLinks(),
		...CategoriesNavLinks(),

		{ rel: 'stylesheet', href: styles }
	];
};

type ContextType = { categories: Category[] };
type LoaderType = {
	numOfItemsInCart: number;
	categories: Category[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const categories = await fetchCategories();

	const numOfItemsInCart = await getItemCount(request);
	return json<LoaderType>({
		numOfItemsInCart,
		categories: categories.cats,
	}, {
		status: StatusCodes.OK,
	});
};

export default function Index() {
	const { numOfItemsInCart, categories } = useLoaderData<LoaderType>();
	const search = useFetcher();

	const handleSearch = (query: string) => {
		search.submit({ query }, { method: 'post', action: '/search' });
	};

	return (
		<>
			{/* sharethis popup for news letter subscription */}
			{/* <div className="powr-popup" id="sharethis-popup-635bb7bc9c9fa7001910fbe2"></div> */}
			<CategoryContext.Provider value={categories} >
				<Form action='/search'>
					<Header
						form='index-search-product'
						categoriesBar={<CategoriesNav categories={categories} />}
						numOfItemsInCart={numOfItemsInCart}
						useSearchSuggests={useSearchSuggests}
						onSearch={handleSearch}
					/>
				</Form>
			</CategoryContext.Provider >

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
