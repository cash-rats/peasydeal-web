import { Outlet, useRouteLoaderData } from 'react-router';
import { V2Layout } from '~/components/v2/GlobalLayout';
import type { RootLoaderData } from '~/root';

export default function ProductLayout() {
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  return (
    <V2Layout
      categories={categories}
      navBarCategories={navBarCategories}
    >
      <Outlet />
    </V2Layout>
  );
}
