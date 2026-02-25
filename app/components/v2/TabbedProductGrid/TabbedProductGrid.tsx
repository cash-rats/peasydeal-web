import { useState, useCallback } from "react";
import { cn } from "~/lib/utils";
import { ProductCard } from "~/components/v2/ProductCard";
import { ProgressIndicator } from "~/components/v2/CollectionPage";
import { LoadMoreButton } from "~/components/v2/LoadMore";
import type { Product } from "~/shared/types";

export interface ProductTab {
  label: string;
  products: Product[];
  /** Link to the full collection/promotion page for this tab */
  href?: string;
  /** API category name — enables Load More when provided */
  category?: string;
  /** Total products available from API */
  total?: number;
  /** Whether more pages are available */
  hasMore?: boolean;
  /** Items per page for Load More requests. Default 16 */
  perPage?: number;
}

export interface TabbedProductGridProps {
  tabs: ProductTab[];
  /** Max products to display per tab when pagination is disabled. Default 8 */
  maxItems?: number;
  shopAllLabel?: string;
  shopAllHref?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Client-side product fetch (via Remix resource route)               */
/* ------------------------------------------------------------------ */

async function fetchMoreProducts(category: string, page: number, perPage: number) {
  const params = new URLSearchParams({
    category,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const resp = await fetch(`/api/products/paginated?${params}`);
  if (!resp.ok) return { items: [] as Product[], total: 0, hasMore: false };

  const json = await resp.json();
  return {
    items: json.items as Product[],
    total: json.total as number,
    hasMore: json.hasMore as boolean,
  };
}

/* ------------------------------------------------------------------ */
/*  Per-tab pagination state                                           */
/* ------------------------------------------------------------------ */

interface TabPaginationState {
  extraProducts: Product[];
  page: number;
  hasMore: boolean;
  total: number;
  loading: boolean;
}

export function TabbedProductGrid({
  tabs,
  maxItems = 8,
  shopAllLabel = "Shop All Products",
  shopAllHref = "/shop",
  onProductClick,
  onAddToCart,
  className,
}: TabbedProductGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Pagination state per tab index
  const [paginationMap, setPaginationMap] = useState<Record<number, TabPaginationState>>({});

  const switchTab = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setFading(true);
      setTimeout(() => {
        setActiveIndex(index);
        setFading(false);
      }, 100);
    },
    [activeIndex]
  );

  const activeTab = tabs[activeIndex];
  const paginationEnabled = !!activeTab?.category;

  // Dynamic "Browse all" link based on active tab
  const browseAllHref = activeTab?.href ?? shopAllHref;
  const browseAllLabel = activeTab?.href
    ? `Browse all ${activeTab.label}`
    : shopAllLabel;

  // Get pagination state for active tab
  const pagination = paginationMap[activeIndex];
  const allProducts = paginationEnabled
    ? [...(activeTab?.products ?? []), ...(pagination?.extraProducts ?? [])]
    : (activeTab?.products ?? []).slice(0, maxItems);

  const currentTotal = pagination?.total ?? activeTab?.total ?? allProducts.length;
  const currentHasMore = pagination?.hasMore ?? activeTab?.hasMore ?? false;
  const isLoading = pagination?.loading ?? false;

  const handleLoadMore = useCallback(async () => {
    if (!activeTab?.category || isLoading) return;

    const perPage = activeTab.perPage ?? 16;
    const nextPage = (pagination?.page ?? 1) + 1;

    // Set loading
    setPaginationMap((prev) => ({
      ...prev,
      [activeIndex]: {
        extraProducts: prev[activeIndex]?.extraProducts ?? [],
        page: prev[activeIndex]?.page ?? 1,
        hasMore: prev[activeIndex]?.hasMore ?? activeTab.hasMore ?? false,
        total: prev[activeIndex]?.total ?? activeTab.total ?? 0,
        loading: true,
      },
    }));

    try {
      const result = await fetchMoreProducts(activeTab.category, nextPage, perPage);
      setPaginationMap((prev) => ({
        ...prev,
        [activeIndex]: {
          extraProducts: [...(prev[activeIndex]?.extraProducts ?? []), ...result.items],
          page: nextPage,
          hasMore: result.hasMore,
          total: result.total,
          loading: false,
        },
      }));
    } catch {
      setPaginationMap((prev) => ({
        ...prev,
        [activeIndex]: {
          ...prev[activeIndex]!,
          loading: false,
        },
      }));
    }
  }, [activeIndex, activeTab, isLoading, pagination]);

  return (
    <section
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12 py-20 bg-white",
        className
      )}
    >
      {/* Tab navigation */}
      <div className="flex justify-between items-baseline mb-10 flex-wrap gap-4">
        <div className="flex gap-6 redesign-md:gap-10 items-baseline">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              className={cn(
                "font-heading text-[20px] redesign-md:text-[28px] border-none bg-transparent p-0 cursor-pointer transition-all duration-fast",
                i === activeIndex
                  ? "font-bold text-black"
                  : "font-light text-[#AAA] hover:text-[#666]"
              )}
              onClick={() => switchTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <a
          href={browseAllHref}
          className="font-body text-sm font-medium text-black underline underline-offset-4 decoration-[1.5px]"
        >
          {browseAllLabel}
        </a>
      </div>

      {/* Product grid */}
      <div
        className={cn(
          "grid grid-cols-2 redesign-sm:grid-cols-3 redesign-md:grid-cols-4 gap-3 redesign-md:gap-5",
          "transition-opacity",
          fading ? "opacity-0 duration-100" : "opacity-100 duration-200"
        )}
      >
        {allProducts.map((product, i) => (
          <ProductCard
            key={product.productUUID ?? i}
            product={product}
            onClick={onProductClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Pagination — only shown when category is provided */}
      {paginationEnabled && (
        <div className="mt-8">
          <ProgressIndicator current={allProducts.length} total={currentTotal} />
          {currentHasMore && (
            <LoadMoreButton
              loading={isLoading}
              onClick={handleLoadMore}
              className="mt-6"
            />
          )}
        </div>
      )}
    </section>
  );
}
