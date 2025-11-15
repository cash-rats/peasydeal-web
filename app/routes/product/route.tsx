import type { LinksFunction } from 'react-router';
import { Outlet, useLoaderData, useRouteLoaderData } from 'react-router';
import httpStatus from 'http-status-codes';

import type { Category } from '~/shared/types';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

type LoaderData = {
  categories: Category[];
  navBarCategories: Category[];
};

export const links: LinksFunction = () => [
  ...CatalogLayoutLinks(),
];

export const loader = async () => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
    });
  } catch (error) {
    console.error(error);

    throw Response.json(error, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export default function ProductLayout() {
  const { categories, navBarCategories } = useLoaderData<LoaderData>() || {};
  const rootData = useRouteLoaderData('root') as { cartCount?: number } | undefined;
  const cartCount = rootData?.cartCount ?? 0;

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      <Outlet />
    </CatalogLayout>
  );
}

