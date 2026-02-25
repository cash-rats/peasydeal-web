import {
  type MetaFunction,
  Outlet,
  useRouteLoaderData,
} from 'react-router';

import { V2Layout } from '~/components/v2/GlobalLayout';
import type { RootLoaderData } from '~/root';

import {
  getBlogTitleText,
  getBlogFBSEO_V2,
} from '~/utils/seo';

export const meta: MetaFunction = () => {
  return [
    {
      title: getBlogTitleText(),
    },
    ...getBlogFBSEO_V2(),
  ]
}

function BlogLayout() {
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  return (
    <V2Layout
      categories={categories}
      navBarCategories={navBarCategories}
    >
      <main className='bg-white'>
        <Outlet />
      </main>
    </V2Layout>
  );
}

export default BlogLayout;
