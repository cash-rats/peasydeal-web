import { useState } from 'react';
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
	Outlet,
	useLoaderData,
	useOutletContext,
} from "@remix-run/react";
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

// @TODOs: deprecate followings infavor of algolia
// import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/_DropDownSearchBar';
// import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
// import useFetcherWithPromise from '~/routes/hooks/useFetcherWithPromise';
// import type { SuggestItem } from '~/shared/types';

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
	const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
	const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

	const handleOpen = () => setOpenSearchDialog(true);

	const handleClose = () => setOpenSearchDialog(false);

	return (
		<>
			{/* sharethis popup for news letter subscription */}
			{/* <div className="powr-popup" id="sharethis-popup-635bb7bc9c9fa7001910fbe2"></div> */}
			<div className="bg-white w-full">
				<MobileSearchDialog
					onBack={handleClose}
					isOpen={openSearchDialog}
				/>

				<Header
					categories={categories}
					// categoriesBar={null}
					categoriesBar={
						<CategoriesNav
							categories={categories}
							topCategories={navBarCategories}
						/>
					}

					mobileSearchBar={
						<SearchBar
							disabled
							placeholder='Search keywords...'
							onClick={handleOpen}
						/>
					}

					searchBar={<DropDownSearchBar />}
				/>

				<main className="min-h-[35rem]">
					<Outlet
						context={{
							categories: categories ? categories.concat(navBarCategories) : []
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
