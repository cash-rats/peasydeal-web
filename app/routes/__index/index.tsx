import { useState, useEffect, useRef, useCallback } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useTransition, useCatch } from "@remix-run/react";
import type { DynamicLinksFunction } from 'remix-utils';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import type { LazyComponentProps } from 'react-lazy-load-image-component';
import httpStatus from 'http-status-codes';

import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product, TCategoryPreview, TPromotionType } from "~/shared/types";
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { checkHasMoreRecord, getCanonicalDomain } from '~/utils';
import { commitSession } from '~/sessions/sessions';
import type { SeasonalInfo } from "~/components/SeasonalColumnLayout/SeasonalColumnLayout";
import ActivityRowLayout, { links as ActivityRowLayoutLinks } from "~/components/SeasonalRowLayout/SeasonalRowLayout";
import { CategoryPreview } from "~/components/CategoryPreview";
import FiveHundredError from "~/components/FiveHundreError";

import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';
import { fetchActivityBanners, fetchProductsByCategoryV2, fetchLandingPageFeatureProducts } from "./api";
import type { ActivityBanner } from "./types";

import styles from "./styles/ProductList.css";
import { modToXItems } from './utils';

type LoaderType = 'loadmore';

type LoaderDataType = {
	categoryPreviews: TCategoryPreview[],
	promotions: TPromotionType[],
	canonical_link: string;
	// products: Product[];
	// page: number;
	// has_more: boolean;
	// activity_banners: ActivityBanner[];
}

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...CssSpinnerLinks(),
		...ProductRowsContainerLinks(),
		...LoadMoreButtonLinks(),
		...ActivityRowLayoutLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => {
	return [
		// Google meta tags
		{ rel: 'canonical', href: data?.canonical_link },
	];
}
export const handle = { dynamicLinks }

type LoaderLoadmoreDateType = {
	products: Product[];
	has_more: boolean;
}

const _loadmoreLoader = async (request: Request, page: number, perPage: number) => {
	const prods = await fetchProductsByCategoryV2({
		perpage: perPage,
		page,
		category: 1, // 1 is the id for category 'Hot Deal'
	})

	const session = await addCategoryProducts(request, [], 'Hot Deal', page);
	return json<LoaderLoadmoreDateType>({
		products: prods,
		has_more: prods.length === perPage,
	}, {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	});
}

export const loader: LoaderFunction = async ({ request }) => {
	// const url = new URL(request.url);

	const landings = await fetchLandingPageFeatureProducts({
		categoriesPreviewNames: [
			'hot_deal',
			'new_trend',
			'electronic',
			// 'clothes_shoes',
			// 'home_appliances',
			// 'kitchen_kitchenware',
			// 'toy',
			// 'pet',
			// 'car_accessories'
		]
	});

	// console.log('debug landings', landings);

	return json<LoaderDataType>({
		...landings,
		canonical_link: getCanonicalDomain(),
	});

	// const actionType = url.searchParams.get('action_type') as LoaderType;

	// if (actionType === 'loadmore') {
	// 	const page = Number(url.searchParams.get('page')) || 1;
	// 	const perPage = Number(url.searchParams.get('per_page')) || 8;

	// 	return _loadmoreLoader(request, page, perPage)
	// }

	// try {
	// 	/**
	// 	 * Get the products from the cache
	// 	 * @type {Promise<unknown>}
	// 	 */
	// 	const [prodInfo, activityBanners = []] = await Promise.all([
	// 		await getCategoryProducts(request, 'Hot Deal'),
	// 		await fetchActivityBanners()
	// 	]);

	// 	/**
	// 	 * Check if the products were found in the session
	// 	 */
	// 	if (prodInfo) {
	// 		/**
	// 		 * Fetch the products from the database
	// 		 * @type {Promise<unknown>}
	// 		 */
	// 		const prods = await fetchProductsByCategoryV2({
	// 			perpage: prodInfo.page * PAGE_LIMIT,
	// 			category: 1, // 1 is the id for category 'Hot Deal'
	// 		})

	// 		/**
	// 		 * Return the products
	// 		 */
	// 		return json<LoaderDataType>({
	// 			products: prods,
	// 			page: prodInfo.page,
	// 			canonical_link: getCanonicalDomain(),
	// 			has_more: checkHasMoreRecord(prods.length, prodInfo.page * PAGE_LIMIT),
	// 			activity_banners: activityBanners,
	// 		});
	// 	}

	// 	/**
	// 	 * Initial the products from the database if not found in the session
	// 	 * @type {Promise<unknown>}
	// 	 */
	// 	const [prods, session] = await Promise.all([
	// 		await fetchProductsByCategoryV2({
	// 			perpage: PAGE_LIMIT,
	// 			page: 1,
	// 			category: 1, // 1 is the id for category 'Hot Deal'
	// 			random: false,
	// 		}),
	// 		await addCategoryProducts(request, [], 'Hot Deal', 1),
	// 	]);

	// 	/**
	// 	 * Return the products
	// 	 */
	// 	return json<LoaderDataType>({
	// 		products: prods,
	// 		page: 1,
	// 		canonical_link: getCanonicalDomain(),
	// 		has_more: prods.length === PAGE_LIMIT,
	// 		activity_banners: activityBanners,
	// 	}, {
	// 		headers: {
	// 			'Set-Cookie': await commitSession(session),
	// 		}
	// 	});
	// } catch (err) {
	// 	throw json(err, {
	// 		status: httpStatus.INTERNAL_SERVER_ERROR,
	// 	})
	// }
};

// TODO: this this should be
// const mockedActivities: SeasonalInfo[] = [
// 	{
// 		src: 'https://storage.googleapis.com/peasydeal/email%2Bcampaign/seasonals/2023trend.jpg',
// 		catId: 2,
// 		title: 'New Trend'
// 	},
// 	{
// 		src: 'https://storage.googleapis.com/peasydeal/email%2Bcampaign/seasonals/boxingday.jpg',
// 		catId: 24,
// 		title: 'Activity-Boxing Day'
// 	},
// 	{
// 		src: 'https://storage.googleapis.com/peasydeal/email%2Bcampaign/seasonals/christmas.jpg',
// 		catId: 23,
// 		title: 'Activity-Christmas'
// 	},
// 	{
// 		src: 'https://storage.googleapis.com/peasydeal/email%2Bcampaign/seasonals/clearance.jpg',
// 		catId: 3,
// 		title: 'Hot Deal'
// 	}
// ];

export const CatchBoundary = () => {
	const caught = useCatch();

	return (
		<FiveHundredError
			message={caught.data}
			statusCode={caught.status}
		/>
	);
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
 * - [x] When number of data fetched is less than limit(9), it reaches the end. stop triggering loadmore but displays a button
 *       letting the user triggering loadmore manually.
 */
type IndexProps = {} & LazyComponentProps;

function Index({ scrollPosition }: IndexProps) {
	const {
		categoryPreviews,
		promotions,
		canonical_link,
	} = useLoaderData<LoaderDataType>();
	// const currPage = useRef(page);
	// const [hasMore, setHasMore] = useState(has_more);
	// const [productRows, setProductRows] = useState<Product[][]>(modToXItems(products));
	// const transition = useTransition();

	// Transition to observe when preload the first page of the product list render
	// const loadmoreFetcher = useFetcher();

	// const handleLoadMore = useCallback(
	// 	() => {
	// 		const nextPage = currPage.current + 1;
	// 		loadmoreFetcher.submit(
	// 			{
	// 				action_type: 'loadmore',
	// 				page: nextPage.toString(),
	// 				per_page: PAGE_LIMIT.toString(),
	// 			},
	// 			{ action: '/?index' }
	// 		);
	// 	}, []);

	// Append products to local state when fetcher type is in `done` state.
	// useEffect(() => {
	// 	if (loadmoreFetcher.type === 'done') {
	// 		const { products } = loadmoreFetcher.data as LoaderLoadmoreDateType;

	// 		if (products.length <= 0) {
	// 			setHasMore(false);
	// 		}

	// 		// Current page fetched successfully, increase page number getting ready to fetch next page.
	// 		currPage.current += 1;
	// 		setProductRows(prev => prev.concat(modToXItems(products)));
	// 	}
	// }, [loadmoreFetcher.type])


	// Redirect to product detail page when click on product.
	const handleClickProduct = (productUUID: string) => {
		console.log('[ga] user clicks on:', productUUID);
	};

	const handleClickShopNow = (catID: number, catTitle: string) => {
		console.log('user clicks on:', catID, catTitle);
	}

	return (
		<div className="">
			<div className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				mx-2 md:mx-4
			">
				<div className="w-full py-2.5 max-w-screen-xl mx-auto">
					{
						categoryPreviews.map((category, index) => {
							return (
								<CategoryPreview
									category={category}
									key={`${category.name}_${index}`}
									onClickProduct={handleClickProduct}
									scrollPosition={scrollPosition}
								/>
							);
						})
					}
				</div>
			</div>

			{/* <ActivityRowLayout activities={mockedActivities} /> */}

			{/* <ProductRowsContainer
					productRows={productRows}
					activityBanners={activity_banners}
					seasonals={mockedActivities}
					onClickProduct={handleClickProduct}
					onClickShopNow={handleClickShopNow}
					scrollPosition={scrollPosition}
				/> */}

			{/* <div className="ProductList__loadmore-container" >
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
										onClick={handleLoadMore}
									/>
								)
						}
					</div>
				</div> */}
		</div>
	);
}

export default trackWindowScroll(Index);