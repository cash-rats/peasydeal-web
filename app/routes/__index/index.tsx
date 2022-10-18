import { useState, useEffect, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit, PrefetchPageLinks } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Spinner from "~/components/Spinner";
import { PAGE_LIMIT } from '~/shared/constants';

import type { Product } from "~/shared/types";

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { fetchProducts, fetchProductsByCategory } from "./api";
import { transformData, organizeTo9ProdsPerRow } from './utils';
import styles from "./styles/ProductList.css";

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...ProductRowsContainerLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const perPage = Number(url.searchParams.get('per_page') || PAGE_LIMIT);
	const page = Number(url.searchParams.get('page') || '1');
	const categoryID = Number(url.searchParams.get('category_id')) || 1;

	console.log('debug 1 ~');

	const respJSON = await fetchProductsByCategory({
		perpage: perPage,
		page,
	})

	console.log('debug 2 ~', respJSON);

	// Transform data to frontend compatible format.
	const transformedProds = transformData(respJSON)
	const prodRows = organizeTo9ProdsPerRow(transformedProds)

	return json({
		...respJSON,
		prod_rows: prodRows,
	}, { status: StatusCodes.OK });
};

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const action = body.get("__action");

	// User queries products, redirect to search result page.
	if (action === 'query_products') {
		const query = body.get("query");
		return redirect(`/products/search?query=${query}`);
	}

	const productID = body.get("product_id");

	return redirect(`/product/${productID}`);
};


/*
 * Product list page.
 *
 * - [ ] 根據 row index 的不同，顯示的 grid layout 會不一樣
 *    - 每 3 個 row OneMainTwoSubs 就會 reverse 一次
 *    - 頭一個 row 是 OneMainTwoSubs Layout
 *
 * - [ ] Fetch products from remote API when initial rendered.
 * - [ ] Fetch more.
 */
export default function Index() {
	const preloadProds = useLoaderData();
	const [productRows, addProductRows] = useState<Product[][]>(preloadProds.prod_rows);
	const currPage = useRef(1);

	// Transition to observe when preload the first page of the product list render
	const fetcher = useFetcher();
	const handleLoadMore = () => {
		currPage.current += 1;
		fetcher.load(`/?index&page=${currPage.current}&per_page=${PAGE_LIMIT}`);
	};


	// Append products to local state when fetcher type is in `done` state.
	useEffect(() => {
		if (fetcher.type === 'done') {
			// Current page fetched successfully, increase page number getting ready to fetch next page.
			const productRows = fetcher.data.prod_rows;
			addProductRows(prev => prev.concat(productRows))
		}
	}, [fetcher])

	// Submit to action to redirect to product detail page.
	const submit = useSubmit();

	// Redirect to product detail page when click on product.
	const handleClickProduct = (productID: string) => {
		submit({ product_id: productID }, { method: 'post' });
	};

	return (
		<div className="prod-list-container">
			<PrefetchPageLinks page='/product/$productId' />

			<ProductRowsContainer
				productRows={productRows}
				onClickProduct={handleClickProduct}
			/>

			<fetcher.Form>
				<input
					type="hidden"
					name="page"
					value={currPage.current}
				/>

				<LoadMore
					spinner={Spinner}
					loading={fetcher.state !== 'idle'}
					callback={handleLoadMore}
					delay={100}
					offset={150}
				/>
			</fetcher.Form>
		</div>
	);
}
