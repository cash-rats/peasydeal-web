import { useState, useEffect, useRef, useCallback } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useTransition } from "@remix-run/react";

import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from "~/shared/types";
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { checkHasMoreRecord } from '~/utils';
import { commitSession } from '~/sessions/redis_session';
import ActivityColumnLayout, { links as ActivityColumnLayoutLinks } from "~/components/ActivityColumnLayout/ActivityColumnLayout";
import type { ActivityInfo } from "~/components/ActivityColumnLayout/ActivityColumnLayout";

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { fetchProductsByCategory } from "./api";
import styles from "./styles/ProductList.css";
import { organizeTo9ProdsPerRow } from './utils';

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...CssSpinnerLinks(),
		...ProductRowsContainerLinks(),
		...LoadMoreButtonLinks(),
		...ActivityColumnLayoutLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}

type LoaderType = {
	products: Product[];
	page: number;
	has_more: boolean;
}

type ActionType = {
	products: Product[];
	has_more: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
	const prodInfo = await getCategoryProducts(request, 'Hot Deal');

	if (prodInfo) {
		const prods = await fetchProductsByCategory({
			perpage: prodInfo.page * PAGE_LIMIT,
			category: 1, // 1 is the id for category 'Hot Deal'
		})

		return json<LoaderType>({
			products: prods,
			page: prodInfo.page,
			has_more: checkHasMoreRecord(prods.length, prodInfo.page * PAGE_LIMIT),
		});
	}

	const prods = await fetchProductsByCategory({
		perpage: PAGE_LIMIT,
		page: 1,
		category: 1, // 1 is the id for category 'Hot Deal'
	})

	const session = await addCategoryProducts(request, [], 'Hot Deal', 1);

	return json<LoaderType>({
		products: prods,
		page: 1,
		has_more: prods.length === PAGE_LIMIT,
	}, {
		headers: {
			'Set-Cookie': await commitSession(session),
		}
	});
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

	const session = await addCategoryProducts(request, [], 'Hot Deal', page);

	return json<ActionType>({
		products: prods,
		has_more: prods.length === perPage,
	}, {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	});
}

const leftActivities: ActivityInfo[] = [
	{
		src: 'https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg',
		catId: 1,
		title: 'some activity'
	},
	{
		src: 'https://static.wowcher.co.uk/binaries/Christmas_Gift_guide-mobile.jpg',
		catId: 1,
		title: 'some activity'
	},
	{
		src: 'https://static.wowcher.co.uk/binaries/Experiences-TILE-MOBILE.jpg',
		catId: 1,
		title: 'some activity'
	},
	{
		src: 'https://static.wowcher.co.uk/binaries/BF-leaked-mobile-wow-tile.jpg',
		catId: 1,
		title: 'some activity'
	}
];

/*
 * Product list page.
 *
 * - [x] 根據 row index 的不同，顯示的 grid layout 會不一樣
 *    - 每 3 個 row OneMainTwoSubs 就會 reverse 一次
 *    - 頭一個 row 是 OneMainTwoSubs Layout
 *
 * - [x] Fetch products from remote API when initial rendered.
 * - [x] Fetch more.
 * - [x] When number of data fetched is less than limit(9), it reaches the end. stop triggering loadmore but displays a button
 *       letting the user triggering loadmore manually.
 * - [ ] Cache product list in local storage.
 */
export default function Index() {
	const { products, has_more, page } = useLoaderData<LoaderType>();
	const currPage = useRef(page);
	const [hasMore, setHasMore] = useState(has_more);
	const [productRows, setProductRows] = useState<Product[][]>(organizeTo9ProdsPerRow(products));
	const transition = useTransition();

	// Transition to observe when preload the first page of the product list render
	const loadmoreFetcher = useFetcher();

	const handleLoadMore = useCallback(
		() => {
			const nextPage = currPage.current + 1;
			loadmoreFetcher.submit(
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
			loadmoreFetcher.submit(
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
		if (loadmoreFetcher.type === 'done') {
			const { products } = loadmoreFetcher.data as ActionType;

			if (products.length <= 0) {
				setHasMore(false);
			}

			// Current page fetched successfully, increase page number getting ready to fetch next page.
			currPage.current += 1;
			setProductRows(prev => prev.concat(organizeTo9ProdsPerRow(products)));
		}
	}, [loadmoreFetcher.type])


	// Redirect to product detail page when click on product.
	const handleClickProduct = (productUUID: string) => {
		console.log('[ga] user clicks on:', productUUID);
	};

	return (
		<div className="Index__wrapper">
			<div className="Index__left-ads-wrapper">
				<ActivityColumnLayout activities={leftActivities} />
			</div>

			<div className="prod-list-container">
				<ProductRowsContainer
					productRows={productRows}
					onClickProduct={handleClickProduct}
				/>

				<loadmoreFetcher.Form className="ProductList__loadmore-container" >
					<input
						type="hidden"
						name="page"
						value={currPage.current}
					/>

					<div>
						{
							hasMore && transition.state === 'idle'
								? (
									<LoadMore
										spinner={<CssSpinner scheme="spinner" />}
										loading={loadmoreFetcher.state !== 'idle'}
										callback={handleLoadMore}
										delay={100}
										offset={150}
									/>
								)
								: (
									<LoadMoreButton
										loading={loadmoreFetcher.state !== 'idle'}
										text='Load more'
										onClick={handleManualLoad}
									/>
								)
						}
					</div>
				</loadmoreFetcher.Form>
			</div>

			<div className="Index__right-ads-wrapper">
				<ActivityColumnLayout activities={leftActivities} />
			</div>
		</div>
	);
}
