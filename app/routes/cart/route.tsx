import { Outlet } from 'react-router';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import httpStatus from 'http-status-codes';
import HorizontalProductsLayout, { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import {
  getCartTitleText,
  getCanonicalDomain,
  getCartFBSEO_V2,
} from '~/utils/seo';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { useCartCount } from '~/routes/hooks';

// export const meta: MetaFunction = () => {
//   return [
//     { title: getCartTitleText() },
//     ...getCartFBSEO_V2(),
//     { tagName: 'link', rel: 'canonical', href: `${getCanonicalDomain()}/cart` },
//   ]
// }

export const links: LinksFunction = () => [
  ...CatalogLayoutLinks(),
  ...HorizontalProductsLayoutLinks(),
];

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[];
  canonicalLink: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
      canonicalLink: `${getCanonicalDomain()}/cart`
    });
  } catch (e) {
    console.error('cart error', e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

function CartLayout() {
  const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
  const cartCount = useCartCount();

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      <Outlet />

      <section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				px-2 md:px-4
				bg-white
        mt-4
			">
        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          {/* Recommended products - top items */}
          {/* @TODO catID should not be hardcoded here */}
          <HorizontalProductsLayout
            catName='hot_deal'
            title='top items'
            seeAllLinkTo='/promotion/hot_deal'
          />

          {/* Recommended products - new trend */}
          {/* @TODO catID should not be hardcoded here */}
          <HorizontalProductsLayout
            catName='new_trend'
            title='new trend'
            seeAllLinkTo='/promotion/new_trend'
          />
        </div>
      </section>
    </CatalogLayout>
  );
}

export default CartLayout;
