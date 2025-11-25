import type { LinksFunction, LoaderFunctionArgs } from 'react-router';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from 'react-router';
import httpStatus from 'http-status-codes';

import type { Category, TCategoryPreview, TPromotionType } from '~/shared/types';
import CatalogLayout, { links as catalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { useCartCount } from '~/routes/hooks';
import PromoActivities from '~/components/PromoActivities/PromoActivities';
import PromoCarousell, { links as PromoCarouselLink } from '~/components/PromoCarousell';
import { CategoryPreview } from '~/components/CategoryPreview';
import FiveHundredError from '~/components/FiveHundreError';
import CategoriesRow from '~/components/CategoriesRow';
import PromoActivitiesVariant from '~/components/PromoActivitiesVariant';
import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import { getCanonicalDomain } from '~/utils';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import { fetchLandingPageFeatureProducts } from './api.server';

type LoaderData = {
  categories: Category[];
  navBarCategories: Category[];
  categoryPreviews: TCategoryPreview[];
  promotionPreviews: TCategoryPreview[];
  promotions: TPromotionType[];
  userAgent: string;
};

export const links: LinksFunction = () => {
  return [
    ...catalogLayoutLinks(),
    ...AllTimeCouponLink(),
    ...PromoCarouselLink(),
    {
      rel: 'canonical',
      href: getCanonicalDomain(),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const userAgent = request.headers.get('user-agent') || '';

    const categoriesPromise = fetchCategoriesWithSplitAndHotDealInPlaced();
    const landingPromise = fetchLandingPageFeatureProducts({
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

    const [[navBarCategories, categories], landings] = await Promise.all([
      categoriesPromise,
      landingPromise,
    ]);

    return Response.json({
      categories,
      navBarCategories,
      categoryPreviews: landings.categoryPreviews,
      promotionPreviews: landings.promotionPreviews,
      promotions: landings.promotions,
      userAgent,
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

export default function LandingPage() {
  const {
    categories = [],
    navBarCategories = [],
    categoryPreviews = [],
    promotionPreviews = [],
    promotions = [],
    userAgent = '',
  } = useLoaderData<LoaderData>() || {};
  const cartCount = useCartCount();

  const handleClickProduct = (productUUID: string) => {
    console.log('[ga] user clicks on:', productUUID);
  };

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      <div className="overflow-hidden">
        <h1 className="absolute top0 left-0 w-[1px] h-[1px] overflow-hidden">
          Welcome to PeasyDeal - Shop Now and Save Big!
        </h1>

        <div className="pt-2.5 px-auto flex flex-col justify-center items-center max-w-screen-xl mx-auto">
          <div className="w-full py-0 mx-2 px-2">
            <AllTimeCoupon />
          </div>
        </div>

        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          <PromoCarousell />
        </div>

        <div className="py-0 px-auto flex flex-col justify-center items-center mx-0">
          <div className="w-full bg-[#F1F1F1]">
            <PromoActivities promotions={promotions} />
          </div>
        </div>

        {promotionPreviews
          .concat(categoryPreviews)
          .map((category, index) => (
            <div key={`/collection/${category.name}_${index}`}>
              <div className="py-0 px-auto flex flex-col justify-center items-center mx-2 md:mx-4">
                <div className="w-full py-2.5 max-w-screen-xl mx-auto">
                  <CategoryPreview
                    key={`${category.name}_${index}`}
                    category={category}
                    onClickProduct={handleClickProduct}
                  />
                </div>
              </div>

              {index === 0 ? <CategoriesRow /> : null}

              {index === 1 ? (
                <div className="py-0 px-auto flex flex-col justify-center items-center bg-slate-50">
                  <div className="w-full py-6 md:py-2.5 md:px-2.5 lg:px-2.5 xl:px-0 max-w-screen-xl mx-auto">
                    <PromoActivitiesVariant />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </CatalogLayout>
  );
}
