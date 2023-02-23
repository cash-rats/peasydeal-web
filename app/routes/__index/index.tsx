import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData, useCatch } from "@remix-run/react";
import type { DynamicLinksFunction } from 'remix-utils';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import type { LazyComponentProps } from 'react-lazy-load-image-component';
import httpStatus from 'http-status-codes';

import type { Category, TCategoryPreview, TPromotionType } from "~/shared/types";
// import { addCategoryProducts } from '~/sessions/productlist.session';
import { getCanonicalDomain } from '~/utils';
// import { commitSession } from '~/sessions/sessions';
// import type { SeasonalInfo } from "~/components/SeasonalColumnLayout/SeasonalColumnLayout";
import PromoActivities from "~/components/PromoActivities/PromoActivities";
import { CategoryPreview } from "~/components/CategoryPreview";
import FiveHundredError from "~/components/FiveHundreError";

import { fetchLandingPageFeatureProducts } from "./api";

import styles from "./styles/ProductList.css";
import CategoriesRow, { links as CategoriesRowLinks } from "~/components/CategoriesRow";
import PromoActivitiesVariant from "~/components/PromoActivitiesVariant";
import AllTimeCoupon, { links as AllTimeCouponLinks } from "~/components/AllTimeCoupon";

type LoaderDataType = {
	categoryPreviews: TCategoryPreview[],
	promotions: TPromotionType[],
	canonical_link: string;
}

export const links: LinksFunction = () => {
	return [
		...CategoriesRowLinks(),
		...AllTimeCouponLinks(),
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

export const loader: LoaderFunction = async ({ request }) => {
	try {
		const landings = await fetchLandingPageFeatureProducts({
			categoriesPreviewNames: [
				'hot_deal',
				'new_trend',
				'electronic',
				'clothes_shoes',
				'kitchen_kitchenware',
				'home_appliances',
				'toy',
				'pet',
				'car_accessories'
			]
		});

		return json<LoaderDataType>({
			...landings,
			canonical_link: getCanonicalDomain(),
		});
	} catch (e) {
		throw json(e, {
			status: httpStatus.INTERNAL_SERVER_ERROR,
		});
	}
};


export const CatchBoundary = () => {
	const caught = useCatch();

	return (
		<FiveHundredError
			message={caught.data}
			statusCode={caught.status}
		/>
	);
}

type IndexProps = {
	categories: Category[];
} & LazyComponentProps;

function Index({ scrollPosition, categories }: IndexProps) {
	const {
		categoryPreviews,
		promotions,
		canonical_link,
	} = useLoaderData<LoaderDataType>();

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
					<AllTimeCoupon />
				</div>
			</div>
			
			<div className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				mx-2 md:mx-4
			">
				<div className="w-full py-2.5 max-w-screen-xl mx-auto">
					<PromoActivities promotions={promotions} />
				</div>
			</div>

			{
				categoryPreviews.map((category, index) => {
					return (
						<div key={`${category.name}_${index}`}>
							<div className="
								py-0 px-auto
								flex flex-col
								justify-center items-center
								mx-2 md:mx-4
							">
								<div className="w-full py-2.5 max-w-screen-xl mx-auto">
									<CategoryPreview
										category={category}
										key={`${category.name}_${index}`}
										onClickProduct={handleClickProduct}
										scrollPosition={scrollPosition}
									/>
								</div>
							</div>

							{
								index === 0
									? <CategoriesRow />
									: null
							}

							{
								index === 1
								? (
									<div className="
										py-0 px-auto
										flex flex-col
										justify-center items-center
										bg-slate-50
									">
										<div className="w-full
											py-6 md:py-2.5
											md:px-2.5 lg:px-2.5 xl:px-0
											max-w-screen-xl mx-auto
										">
											<PromoActivitiesVariant />
										</div>
									</div>
								)
								: null
							}
						</div>
					);
				})
			}
		</div>
	);
}

export default trackWindowScroll(Index);