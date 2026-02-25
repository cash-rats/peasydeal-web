import { useMemo } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Link, useLoaderData, useRouteLoaderData } from 'react-router';
import { cn } from '~/lib/utils';

import type { Category, Product } from '~/shared/types';
import type { RootLoaderData } from '~/root';
import { getCanonicalDomain } from '~/utils/seo';
import { fetchProductsByCategoryV2 } from '~/api/products';

import { V2Layout } from '~/components/v2/GlobalLayout';
import { CollectionHeader } from '~/components/v2/CollectionPage';
import { TabbedProductGrid } from '~/components/v2/TabbedProductGrid';
import { NotFoundPage } from '~/components/v2/ErrorPage';

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */

type TabData = {
  products: Product[];
  total: number;
  hasMore: boolean;
};

type LoaderData = {
  trending: TabData;
  hotDeals: TabData;
};

export const meta: MetaFunction = () => [
  { title: 'Shop All Categories | PeasyDeal' },
  {
    tagName: 'meta',
    name: 'description',
    content:
      'Browse all product categories at PeasyDeal. Discover unbeatable deals across every department.',
  },
  { tagName: 'link', rel: 'canonical', href: `${getCanonicalDomain()}/shop-all` },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [trending, hotDeals] = await Promise.all([
    fetchProductsByCategoryV2({ category: 'new_trend', perpage: 16 }),
    fetchProductsByCategoryV2({ category: 'hot_deal', perpage: 16 }),
  ]);

  return {
    trending: { products: trending.items, total: trending.total, hasMore: trending.hasMore },
    hotDeals: { products: hotDeals.items, total: hotDeals.total, hasMore: hotDeals.hasMore },
  } satisfies LoaderData;
};

/* ------------------------------------------------------------------ */
/*  Category Card Grid                                                 */
/* ------------------------------------------------------------------ */

const CARD_COLORS = [
  '#F0EBE3', // warm beige
  '#E8EDE4', // sage
  '#EDE4E8', // dusty rose
  '#E4E8ED', // slate
  '#F0E8E0', // peach
  '#E8E4F0', // lavender
  '#E3EDE8', // mint
  '#EDE8E3', // sand
];

function CategoryCard({
  category,
  colorIndex,
}: {
  category: Category;
  colorIndex: number;
}) {
  const bg = CARD_COLORS[colorIndex % CARD_COLORS.length];
  const displayTitle = category.title || category.label || category.name;

  return (
    <Link
      to={`/collection/${category.name}`}
      className={cn(
        'group relative flex flex-col justify-end rounded-rd-md p-5 no-underline',
        'aspect-[3/2] overflow-hidden',
        'transition-all duration-normal',
        'hover:-translate-y-0.5 hover:shadow-card-hover',
        'active:translate-y-0 active:shadow-overlay'
      )}
      style={{ backgroundColor: bg }}
    >
      <h3 className="font-heading text-lg font-bold text-black leading-tight mb-1">
        {displayTitle}
      </h3>
      {category.count > 0 && (
        <p className="font-body text-sm text-[#666]">
          {category.count} {category.count === 1 ? 'product' : 'products'}
        </p>
      )}

      {/* Arrow icon */}
      <div
        className={cn(
          'absolute top-4 right-4 w-8 h-8 rounded-full border border-[#00000015]',
          'flex items-center justify-center',
          'transition-colors duration-fast',
          'group-hover:bg-black group-hover:border-black'
        )}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="text-black group-hover:text-white transition-colors duration-fast"
        >
          <path
            d="M4 10L10 4M10 4H5M10 4V9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ShopAll() {
  const { trending, hotDeals } = useLoaderData<LoaderData>();

  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const breadcrumbs = useMemo(
    () => [{ label: 'Home', href: '/' }, { label: 'Shop All' }],
    []
  );

  const productTabs = useMemo(() => {
    const tabs = [];
    if (trending.products.length > 0) {
      tabs.push({
        label: 'Trending',
        products: trending.products,
        href: '/promotion/new_trend',
        category: 'new_trend',
        total: trending.total,
        hasMore: trending.hasMore,
        perPage: 16,
      });
    }
    if (hotDeals.products.length > 0) {
      tabs.push({
        label: 'Hot Deals',
        products: hotDeals.products,
        href: '/promotion/hot_deal',
        category: 'hot_deal',
        total: hotDeals.total,
        hasMore: hotDeals.hasMore,
        perPage: 16,
      });
    }
    return tabs;
  }, [trending, hotDeals]);

  // Use normalized categories from root loader, filter to non-promotion with products
  const displayCategories = useMemo(
    () =>
      categories.filter(
        (c) => c.type !== 'promotion' && c.count > 0
      ),
    [categories]
  );

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <div className="v2 max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-4">
        <CollectionHeader
          title="Shop All"
          description="Browse our full range of categories and discover deals across every department."
          breadcrumbs={breadcrumbs}
        />

        {/* Category Cards Grid */}
        {displayCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-black mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 redesign-sm:grid-cols-3 redesign-md:grid-cols-4 gap-4">
              {displayCategories.map((cat, i) => (
                <CategoryCard key={cat.name} category={cat} colorIndex={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Recommended Products — full-width (TabbedProductGrid has its own container) */}
      {productTabs.length > 0 && (
        <TabbedProductGrid
          tabs={productTabs}
          shopAllLabel="View All Products"
          shopAllHref="/promotion/new_trend"
        />
      )}
    </V2Layout>
  );
}

export function ErrorBoundary() {
  return <NotFoundPage />;
}
