import { useState } from 'react';
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
import type { Category, SuggestItem } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { getItemCount } from '~/utils/shoppingcart.session';
import MobileSearchDialog, { links as MobileSearchDialogLinks } from '~/components/MobileSearchDialog'
import { fetchCategories } from '~/categories.server';
import { fetchProductsByCategory } from '~/api';

import styles from "./styles/index.css";


export const links: LinksFunction = () => {
	return [
		...FooterLinks(),
		...HeaderLinks(),
		...CategoriesNavLinks(),
		...MobileSearchDialogLinks(),

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
		categories: categories,
	}, {
		status: StatusCodes.OK,
	});
};

export default function Index() {
	const { numOfItemsInCart, categories } = useLoaderData<LoaderType>();
	const search = useFetcher();
	const [openSearchDialog, setOpenSearchDialog] = useState(false);
	const [suggests, searchSuggests] = useSearchSuggests();

	const handleSearch = (query: string) => {
		search.submit({ query }, { method: 'post', action: '/search' });
	};

	const handleOnClickMobileSearch = () => {
		setOpenSearchDialog(true);
	};

	const handleClose = () => {
		setOpenSearchDialog(false);
	}

	const handleSearchRequest = async (query: string): Promise<SuggestItem[]> => {
		const products = await fetchProductsByCategory({ title: query });

		let suggestItems: SuggestItem[] = [];

		if (products.length > 0) {
			// Transform product result to suggest item.
			suggestItems = products.map<SuggestItem>((product) => {
				return {
					title: product.title,
					data: {
						title: product.title,
						image: product.main_pic,
						discount: product.discount,
						productID: product.productUUID,
					},
				};
			});
		}

		return suggestItems;
	}

	return (
		<>
			{/* sharethis popup for news letter subscription */}
			{/* <div className="powr-popup" id="sharethis-popup-635bb7bc9c9fa7001910fbe2"></div> */}
			<MobileSearchDialog
				onBack={handleClose}
				open={openSearchDialog}
				onSearchRequest={handleSearchRequest}
			/>

			<CategoryContext.Provider value={categories} >
				<Form className="header-wrapper" action='/search'>
					<Header
						form='index-search-product'
						categoriesBar={<CategoriesNav categories={categories} />}
						numOfItemsInCart={numOfItemsInCart}
						useSearchSuggests={useSearchSuggests}
						onSearch={handleSearch}
						onClickMobileSearch={handleOnClickMobileSearch}
					/>
				</Form>
			</CategoryContext.Provider >

			<main className="main-container">
				<Outlet context={{ categories: categories }} />
				{/* <Outlet /> */}
			</main>

			<Footer />
		</>
	);
}

export function useContext() {
	return useOutletContext<ContextType>();
};
