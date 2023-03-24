import { useState } from 'react';
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
	Outlet,
	useLoaderData,
	useOutletContext,
	useFetcher,
} from "@remix-run/react";
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import type { SuggestItem } from '~/shared/types';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import useFetcherWithPromise from '~/routes/hooks/useFetcherWithPromise';

type LoaderType = {
	categories: Category[];
	navBarCategories: Category[];
};

export const links: LinksFunction = () => {
	return [
		...FooterLinks(),
		...HeaderLinks(),
		...CategoriesNavLinks(),
		...DropDownSearchBarLinks(),
	];
};

type ContextType = {
	categories: Category[],
	navBarCategories: Category[]
};


export const loader: LoaderFunction = async ({ request }) => {
	try {
		const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

		return json<LoaderType>({
			categories,
			navBarCategories,
		});
	} catch (e) {
		throw json(e, {
			status: httpStatus.INTERNAL_SERVER_ERROR,
		});
	}
};

export default function Index() {
	const { categories, navBarCategories } = useLoaderData<LoaderType>();
	const search = useFetcher();
	const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
	const [suggests, searchSuggests] = useSearchSuggests();
	const { submit } = useFetcherWithPromise();

	const handleSearch = (query: string) => {
		search.submit({ query }, { method: 'post', action: '/search?index' });
	};

	const handleOpen = () => setOpenSearchDialog(true);

	const handleClose = () => setOpenSearchDialog(false);

	const handleSearchRequest = async (query: string): Promise<SuggestItem[]> => {
		const data = await submit(
			{ query },
			{
				method: 'post',
				action: '/hooks/auto-complete-search?index'
			}
		);

		let suggestItems: SuggestItem[] = [];
		const products: any[] = data.results;

		if (products.length > 0) {
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
			<div className="bg-white">
				<MobileSearchDialog
					onBack={handleClose}
					isOpen={openSearchDialog}
					onSearchRequest={handleSearchRequest}
					onSearch={handleSearch}
				/>

				<Header
					categories={categories}
					categoriesBar={
						<CategoriesNav
							categories={categories}
							topCategories={navBarCategories}
						/>
					}
					mobileSearchBar={
						<SearchBar
							placeholder='Search keywords...'
							onClick={handleOpen}
						/>
					}

					searchBar={
						<DropDownSearchBar
							placeholder='Search products by name'
							onDropdownSearch={searchSuggests}
							results={suggests}
							onSearch={handleSearch}
						/>
					}
				/>

				<main className="min-h-[35rem]">
					<Outlet
						context={{
							categories: categories.concat(navBarCategories)
						}}
					/>
				</main>

				<Footer categories={categories} />
			</div>
		</>
	);
}

export function useContext() {
	return useOutletContext<ContextType>();
};
