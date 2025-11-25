import type { LinksFunction } from 'react-router';
import { Outlet, useLoaderData } from 'react-router';
import httpStatus from 'http-status-codes';

import type { Category } from '~/shared/types';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import { useCartCount } from '~/routes/hooks';

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
  const cartCount = useCartCount();

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
