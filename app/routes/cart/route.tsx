import type { LinksFunction } from 'react-router';
import { Outlet, useRouteLoaderData } from 'react-router';
import HorizontalProductsLayout from '~/routes/components/HorizontalProductsLayout';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { useCartCount } from '~/routes/hooks';
import type { RootLoaderData } from '~/root';

export const links: LinksFunction = () => [
  ...CatalogLayoutLinks(),
];

function CartLayout() {
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const cartCount = useCartCount();

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      <div>
        <Outlet />

        <section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				px-2 md:px-4
				bg-white
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
      </div>
    </CatalogLayout>
  );
}

export default CartLayout;
