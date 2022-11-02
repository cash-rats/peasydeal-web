import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { PAGE_LIMIT } from '~/shared/constants';

import type { Product } from "~/shared/types";

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { fetchProductsByCategory } from "./api";
import styles from "./styles/ProductList.css";
import { ProductsContext, addProducts } from '../reducers/products_reducer';

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...CssSpinnerLinks(),
		...ProductRowsContainerLinks(),
		...LoadMoreButtonLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}


type ActionType = {
	products: Product[];
	has_more: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
	return null
};

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const page = Number(body.get("page") || '1');
	const perPage = Number(body.get("per_page")) || PAGE_LIMIT;

	const prods = await fetchProductsByCategory({
		perpage: perPage,
		page,
		category: 1, // 1 is the id for category 'Hot Deal'
	})

	return json<ActionType>({
		products: prods,
		has_more: prods.length === PAGE_LIMIT,
	}, { status: StatusCodes.OK });
}

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
	const [state, dispatch] = useContext(ProductsContext);

	const firstLoad = useRef(false);
	const currPage = useRef(1);
	const [hasMore, setHasMore] = useState(true);

	// Transition to observe when preload the first page of the product list render
	const fetcher = useFetcher();
	const handleLoadMore = useCallback(
		() => {
			const nextPage = currPage.current + 1;
			fetcher.submit(
				{
					page: nextPage.toString(),
					per_page: PAGE_LIMIT.toString(),
				},
				{
					method: 'post',
					action: '/?index'
				}
			);
		}, []);

	const handleManualLoad = useCallback(
		() => {
			const nextPage = currPage.current + 1;
			fetcher.submit(
				{
					page: nextPage.toString(),
					per_page: PAGE_LIMIT.toString(),
				},
				{
					method: 'post',
					action: '/?index'
				}
			);
		}, []);

	// Append products to local state when fetcher type is in `done` state.
	useEffect(() => {
		if (fetcher.type === 'done') {
			const { products } = fetcher.data as ActionType;

			if (products.length <= 0) {
				setHasMore(false);
			}

			// Current page fetched successfully, increase page number getting ready to fetch next page.
			currPage.current += 1;

			dispatch(addProducts(products));
		}
	}, [fetcher])

	useEffect(() => {
		if (firstLoad && !firstLoad.current) {
			fetcher.submit(
				{
					page: currPage.current.toString(),
					per_page: PAGE_LIMIT.toString(),
				},
				{
					method: 'post',
					action: '/?index',
				},
			);
			firstLoad.current = true;
		}
	}, []);

	// Redirect to product detail page when click on product.
	const handleClickProduct = (productUUID: string) => {
		console.log('[ga] user clicks on:', productUUID);
	};

	return (
		<div className="prod-list-container">
			<ProductRowsContainer
				productRows={state.product_rows}
				onClickProduct={handleClickProduct}
			/>

			<fetcher.Form className="ProductList__loadmore-container" >
				<input
					type="hidden"
					name="page"
					value={currPage.current}
				/>
				<div>
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
