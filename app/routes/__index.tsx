import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
	Outlet,
	useLoaderData,
	useOutletContext,
	Form,
	useFetcher,
} from "@remix-run/react";

import CategoryContext from '~/context/categories';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { getItemCount } from '~/sessions/shoppingcart.session';
import { fetchCategories } from '~/api/categories.server';

type LoaderType = {
	numOfItemsInCart: number;
	categories: Category[];
};

export const links: LinksFunction = () => {
	return [
		...FooterLinks(),
		...HeaderLinks(),
		...CategoriesNavLinks(),
		...DropDownSearchBarLinks(),
	];
};

type ContextType = { categories: Category[] };

export const loader: LoaderFunction = async ({ request }) => {
	const categories = await fetchCategories();
	const numOfItemsInCart = await getItemCount(request);

	return json<LoaderType>({
		numOfItemsInCart,
		categories: categories,
	});
};

export default function Index() {
	const { numOfItemsInCart, categories } = useLoaderData<LoaderType>();
	const search = useFetcher();
	const [suggests, searchSuggests] = useSearchSuggests();

	const handleSearch = (query: string) => {
		search.submit({ query }, { method: 'post', action: '/search' });
	};

	return (
		<>
			{/* sharethis popup for news letter subscription */}
			{/* <div className="powr-popup" id="sharethis-popup-635bb7bc9c9fa7001910fbe2"></div> */}
			<div className="pt-28 bg-center bg-cover bg-no-repeat bg-home-gradient-light-sm md:pt-40 md:bg-home-gradient-light">
				<CategoryContext.Provider value={categories} >
					<Form className="header-wrapper" action='/search'>
						<Header
							form='index-search-product'
							categoriesBar={
								<CategoriesNav categories={categories} />
							}
							searchBar={
								<DropDownSearchBar
									form='index-search-product'
									placeholder='Search products by name'
									onDropdownSearch={searchSuggests}
									results={suggests}
									onSearch={handleSearch}
								/>
							}
							numOfItemsInCart={numOfItemsInCart}
							onSearch={handleSearch}
						/>
					</Form>
				</CategoryContext.Provider >

				<main className="min-h-[35rem]">
					<Outlet context={{ categories: categories }} />
				</main>

				<Footer />
			</div>
		</>
	);
}

export function useContext() {
	return useOutletContext<ContextType>();
};
