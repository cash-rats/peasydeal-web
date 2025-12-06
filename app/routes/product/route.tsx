import type { LinksFunction } from 'react-router';
import { Outlet, useRouteLoaderData } from 'react-router';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { useCartCount } from '~/routes/hooks';
import type { RootLoaderData } from '~/root';

export const links: LinksFunction = () => [
  ...CatalogLayoutLinks(),
];

export default function ProductLayout() {
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
      <Outlet />
    </CatalogLayout>
  );
}
