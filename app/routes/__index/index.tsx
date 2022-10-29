import { useState, useEffect, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { PAGE_LIMIT } from '~/shared/constants';

import type { Product } from "~/shared/types";

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { fetchProductsByCategory } from "./api";
import { organizeTo9ProdsPerRow } from './utils';
import styles from "./styles/ProductList.css";

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...CssSpinnerLinks(),
		...ProductRowsContainerLinks(),
		...LoadMoreButtonLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}

type ActionType = 'query_products';

type LoaderType = {
	prod_rows: Product[][];
	has_more: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const perPage = Number(url.searchParams.get('per_page') || PAGE_LIMIT);
	const page = Number(url.searchParams.get('page') || '1');

	const prods = await fetchProductsByCategory({
		perpage: perPage,
		page,
	})

	let prodRows: Product[][] = [];

	if (prods.length > 0) {
		// Transform data to frontend compatible format.
		prodRows = organizeTo9ProdsPerRow(prods)
	}

	return json<LoaderType>({
		prod_rows: prodRows,
		has_more: prods.length === PAGE_LIMIT,
	}, { status: StatusCodes.OK });
};

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const action = body.get("__action") as ActionType;

	// User queries products, redirect to search result page.
	if (action === 'query_products') {
		const query = body.get("query");
		return redirect(`/products/search?query=${query}`);
	}

	return null;
};


/*
 * Product list page.
 *
 * - [x] 根據 row index 的不同，顯示的 grid layout 會不一樣
 *    - 每 3 個 row OneMainTwoSubs 就會 reverse 一次
 *    - 頭一個 row 是 OneMainTwoSubs Layout
 *
 * - [x] Fetch products from remote API when initial rendered.
 * - [x] Fetch more.
 * - [ ] When number of data fetched is less than limit(9), it reaches the end. stop triggering loadmore but displays a button
 *       letting the user triggering loadmore manually.
 */
export default function Index() {
	const { prod_rows, has_more } = useLoaderData<LoaderType>();
	const [productRows, addProductRows] = useState<Product[][]>(prod_rows);
	const currPage = useRef(1);
	const [hasMore, setHasMore] = useState(has_more);

	// Transition to observe when preload the first page of the product list render
	const fetcher = useFetcher();
	const handleLoadMore = () => {
		const nextPage = currPage.current + 1;
		fetcher.load(`/?index&page=${nextPage}&per_page=${PAGE_LIMIT}`);
	};

	const handleManualLoad = () => {
		fetcher.load(`/?index&page=${currPage.current}&per_page=${PAGE_LIMIT}`);
	}

	// Append products to local state when fetcher type is in `done` state.
	useEffect(() => {
		if (fetcher.type === 'done') {
			const productRows = fetcher.data.prod_rows;

			// Current page fetched successfully, increase page number getting ready to fetch next page.
			if (productRows.length > 0) {
				currPage.current += 1;
			}

			if (productRows.length <= 0) {
				setHasMore(false);

				return;
			}

			addProductRows(prev => prev.concat(productRows))
		}
	}, [fetcher])


	// Redirect to product detail page when click on product.
	const handleClickProduct = (productUUID: string) => {
		console.log('[ga] user clicks on:', productUUID);
	};

	return (
		<div className="prod-list-container">
			<ProductRowsContainer
				productRows={productRows}
				onClickProduct={handleClickProduct}
			/>

			<fetcher.Form className="ProductList__loadmore-container" >
				<input
					type="hidden"
					name="page"
					value={currPage.current}
				/>

				<div >
					{
						hasMore
							? (
								<LoadMore
									spinner={<CssSpinner scheme="spinner" />}
									loading={fetcher.state !== 'idle'}
									callback={handleLoadMore}
									delay={100}
									offset={150}
								/>
							)
							: (
								<LoadMoreButton
									loading={fetcher.state !== 'idle'}
									text='Load more'
									onClick={handleManualLoad}
								/>
							)
					}
				</div>
			</fetcher.Form>
		</div>
	);
}
