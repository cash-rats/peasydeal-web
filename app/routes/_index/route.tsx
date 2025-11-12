import { useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs } from 'react-router';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import type { Category, TCategoryPreview, TPromotionType } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import PromoActivities from '~/components/PromoActivities/PromoActivities';
import PromoCarousell, { links as PromoCarouselLink } from '~/components/PromoCarousell';
import { CategoryPreview } from '~/components/CategoryPreview';
import FiveHundredError from '~/components/FiveHundreError';
import CategoriesRow from '~/components/CategoriesRow';
import PromoActivitiesVariant from '~/components/PromoActivitiesVariant';
import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';
import { getCanonicalDomain, isFromGoogleStoreBot } from '~/utils';
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
    ...FooterLinks(),
    ...HeaderLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
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

  const rootData = useRouteLoaderData('root') as { cartCount?: number } | undefined;
  const cartCount = rootData?.cartCount ?? 0;
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  const handleOpen = () => setOpenSearchDialog(true);
  const handleClose = () => setOpenSearchDialog(false);

  const handleClickProduct = (productUUID: string) => {
    console.log('[ga] user clicks on:', productUUID);
  };

  return (
    <>
      <Header
        categories={categories}
        numOfItemsInCart={cartCount}
        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }
        mobileSearchBar={
          <SearchBar
            placeholder='Search keywords...'
            onClick={handleOpen}
            onTouchEnd={handleOpen}
          />
        }
        searchBar={<DropDownSearchBar />}
      />

      <main className="min-h-[35rem] bg-white">
        <div className="overflow-hidden">
          <h1 className="absolute top0 left-0 w-[1px] h-[1px] overflow-hidden">
            Welcome to PeasyDeal - Shop Now and Save Big!
          </h1>
          <PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(userAgent)} />

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
              <div
                key={`/collection/${category.name}_${index}`}
              >
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
      </main>

      <Footer categories={categories} />

      <MobileSearchDialog
        isOpen={openSearchDialog}
        onBack={handleClose}
      />
    </>
  );
}
