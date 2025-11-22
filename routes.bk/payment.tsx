import { Outlet, useLoaderData } from 'react-router';
import type { LinksFunction, MetaFunction } from 'react-router';
import httpStatus from 'http-status-codes';

import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import { getPaymentSuccessTitleText } from '~/utils/seo';
import { useCartCount } from '~/routes/hooks';

export const links: LinksFunction = () => {
  return [
    ...CatalogLayoutLinks(),
  ];
}

export const meta: MetaFunction = () => ([
  { title: getPaymentSuccessTitleText() },
]);

export const loader = async () => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
    })
  } catch (e) {
    console.error(e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function Payment() {
  const { categories, navBarCategories } = useLoaderData<typeof loader>() || {};
  const cartCount = useCartCount();

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >

      <div className="min-h-[35rem] flex justify-center">
        <Outlet />
      </div>

    </CatalogLayout>
  );
}
