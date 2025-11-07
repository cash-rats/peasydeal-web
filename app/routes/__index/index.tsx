import type { LoaderFunction, LinksFunction } from "react-router";
import { useLoaderData, useRouteError, isRouteErrorResponse } from "react-router";
import { trackWindowScroll } from 'react-lazy-load-image-component';
import type { LazyComponentProps } from 'react-lazy-load-image-component';
import httpStatus from 'http-status-codes';

import type { TCategoryPreview, TPromotionType } from "~/shared/types";
import { getCanonicalDomain } from '~/utils';
import PromoActivities from "~/components/PromoActivities/PromoActivities";
import PromoCarousell, { links as PromoCarouselLink } from "~/components/PromoCarousell";
import { CategoryPreview } from "~/components/CategoryPreview";
import FiveHundredError from "~/components/FiveHundreError";
import CategoriesRow from "~/components/CategoriesRow";
import PromoActivitiesVariant from "~/components/PromoActivitiesVariant";
import AllTimeCoupon from "~/components/AllTimeCoupon";
import { links as AllTimeCouponLink } from "~/components/AllTimeCoupon";
import PromoteSubscriptionModal from "~/components/PromoteSubscriptionModal";
import { isFromGoogleStoreBot } from '~/utils';

import { fetchLandingPageFeatureProducts } from "./api";

type LoaderDataType = {
  categoryPreviews: TCategoryPreview[],
  promotionPreviews: TCategoryPreview[],
  promotions: TPromotionType[],
  userAgent: string;
}

export const links: LinksFunction = () => {
  return [
    ...AllTimeCouponLink(),
    ...PromoCarouselLink(),
    // Canonical link
    {
      rel: 'canonical',
      href: getCanonicalDomain(),
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const userAgent = request.headers.get('user-agent');

    const landings = await fetchLandingPageFeatureProducts({
      categoriesPreviewNames: [
        'hardware',
        'vehicles-and-parts',
        'animals-and-pet-supplies',
        'cameras-and-optics',
        'luggage-and-bags',
        'apparel-and-accessories',
        'new_trend',
      ],
    });

    return Response.json({
      categoryPreviews: landings.categoryPreviews,
      promotionPreviews: landings.promotionPreviews,
      promotions: landings.promotions,
      userAgent: userAgent || '',
    });
  } catch (e) {
    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};


export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <FiveHundredError
        error={new Error(error.statusText || 'Route Error')}
        statusCode={error.status}
      />
    );
  }

  return (
    <FiveHundredError
      error={error instanceof Error ? error : new Error('Unknown error')}
      statusCode={500}
    />
  );
}

type IndexProps = {} & LazyComponentProps;

function Index({ scrollPosition }: IndexProps) {
  const {
    categoryPreviews,
    promotionPreviews,
    promotions,
    userAgent,
  } = useLoaderData<LoaderDataType>() || {};

  // Redirect to product detail page when click on product.
  const handleClickProduct = (productUUID: string) => {
    console.log('[ga] user clicks on:', productUUID);
  };

  return (
    <div className="overflow-hidden">
      <h1 className="absolute top0 left-0 w-[1px] h-[1px] overflow-hidden">Welcome to PeasyDeal - Shop Now and Save Big!</h1>
      <PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(userAgent)} />

      <div className="
				pt-2.5 px-auto
				flex flex-col
				justify-center items-center
				max-w-screen-xl
				mx-auto
			">
        <div className="w-full py-0 mx-2 px-2">
          <AllTimeCoupon />
        </div>
      </div>

      <div
        className="
					w-full py-2.5 max-w-screen-xl mx-auto
				">
        <PromoCarousell />
      </div>

      <div className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				mx-0
			">
        <div className="w-full bg-[#F1F1F1]">
          <PromoActivities promotions={promotions} />
        </div>
      </div>

      {
        promotionPreviews
          .concat(categoryPreviews)
          .map((category, index) => {
            return (
              <div
                key={`/collection/${category.name}_${index}`}>
                <div className="
								  py-0 px-auto
								  flex flex-col
								  justify-center items-center
								  mx-2 md:mx-4
							  ">
                  <div className="w-full py-2.5 max-w-screen-xl mx-auto">
                    <CategoryPreview
                      key={`${category.name}_${index}`}
                      category={category}
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
