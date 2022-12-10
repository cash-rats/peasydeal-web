import { useState, useEffect, useRef, useCallback } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useTransition } from "@remix-run/react";
import type { DynamicLinksFunction } from 'remix-utils';

import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from "~/shared/types";
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { checkHasMoreRecord, getCanonicalDomain } from '~/utils';
import { commitSession } from '~/sessions/redis_session';
import ActivityColumnLayout, { links as ActivityColumnLayoutLinks } from "~/components/SeasonalColumnLayout/SeasonalColumnLayout";
import type { SeasonalInfo } from "~/components/SeasonalColumnLayout/SeasonalColumnLayout";
import ActivityRowLayout, { links as ActivityRowLayoutLinks } from "~/components/SeasonalRowLayout/SeasonalRowLayout";

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { fetchProductsByCategory, fetchActivityBanners } from "./api";
import type { ActivityBanner } from "./types";

import styles from "./styles/ProductList.css";
import { organizeTo9ProdsPerRow } from './utils';

type LoaderType = {
	products: Product[];
	page: number;
	canonical_link: string;
	has_more: boolean;
	activity_banners: ActivityBanner[];
}

type ActionDataType = {
	products: Product[];
	has_more: boolean;
};

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...CssSpinnerLinks(),
		...ProductRowsContainerLinks(),
		...LoadMoreButtonLinks(),
		...ActivityColumnLayoutLinks(),
		...ActivityRowLayoutLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}

const dynamicLinks: DynamicLinksFunction<LoaderType> = ({ data }) => {
	return [
		{
			rel: 'canonical', href: data.canonical_link,
		},
	];
}
export const handle = { dynamicLinks }

export const loader: LoaderFunction = async ({ request }) => {
	try {
		const [prodInfo, activityBanners] = await Promise.all([
			await getCategoryProducts(request, 'Hot Deal'),
			await fetchActivityBanners(),
		])

		if (prodInfo) {
			const prods = await fetchProductsByCategory({
				perpage: prodInfo.page * PAGE_LIMIT,
				category: 1, // 1 is the id for category 'Hot Deal'
			})

			return json<LoaderType>({
				products: prods,
				page: prodInfo.page,
				canonical_link: getCanonicalDomain(),
				has_more: checkHasMoreRecord(prods.length, prodInfo.page * PAGE_LIMIT),
				activity_banners: activityBanners,
			});
		}

		const [prods, session] = await Promise.all([
			await fetchProductsByCategory({
				perpage: PAGE_LIMIT,
				page: 1,
				category: 1, // 1 is the id for category 'Hot Deal'
			}),
			await addCategoryProducts(request, [], 'Hot Deal', 1),
		]);

		return json<LoaderType>({
			products: prods,
			page: 1,
			canonical_link: getCanonicalDomain(),
			has_more: prods.length === PAGE_LIMIT,
			activity_banners: activityBanners,
		}, {
			headers: {
				'Set-Cookie': await commitSession(session),
			}
		});
	} catch (err) {
		console.log('err', err);
	}
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

	return json<ActionDataType>({
		products: prods,
		has_more: prods.length === perPage,
	}, {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	});
}

const mockedActivities: SeasonalInfo[] = [
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
 */
export default function Index() {
	const { products, has_more, page, activity_banners } = useLoaderData<LoaderType>();
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
			const { products } = loadmoreFetcher.data as ActionDataType;

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

	const handleClickShopNow = (catID: number, catTitle: string) => {
		console.log('user clicks on:', catID, catTitle);
	}

	return (
		<>
			<div className="Index__wrapper">
				{/* Display when width > 1600  */}
				{/* <div className="Index__left-ads-wrapper">
					<ActivityColumnLayout activities={mockedActivities} />
				</div> */}

				<div className="prod-list-container">
					<ActivityRowLayout activities={mockedActivities} />

					<ProductRowsContainer
						productRows={productRows}
						activityBanners={activity_banners}
						onClickProduct={handleClickProduct}
						onClickShopNow={handleClickShopNow}
					/>

					<div className="ProductList__loadmore-container" >
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
					</div>
				</div>

				{/* <div className="Index__right-ads-wrapper">
					<ActivityColumnLayout activities={mockedActivities} />
				</div> */}
			</div>
		</>
	);
}
