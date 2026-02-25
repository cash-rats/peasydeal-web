import { cn } from "~/lib/utils";
import type { Product } from "~/shared/types";
import { ProductCard } from "~/components/v2/ProductCard/ProductCard";

/* ------------------------------------------------------------------ */
/*  SortBar                                                            */
/* ------------------------------------------------------------------ */

export interface SortBarProps {
  total: number;
  current: number;
  className?: string;
}

export function SortBar({ total, current, className }: SortBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-6 pb-4 border-b border-[#F0F0F0]",
        className
      )}
    >
      <span className="font-body text-[13px] text-rd-text-secondary">
        Showing {current} of {total} products
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ProgressIndicator                                                  */
/* ------------------------------------------------------------------ */

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressIndicator({
  current,
  total,
  className,
}: ProgressIndicatorProps) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className={cn("w-full max-w-[200px] mx-auto mt-6", className)}>
      <p className="font-body text-[13px] text-rd-text-secondary text-center mb-2">
        Showing {current} of {total}
      </p>
      <div className="h-0.5 bg-[#F0F0F0] rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-slow rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductGrid                                                        */
/* ------------------------------------------------------------------ */

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        "redesign-sm:grid-cols-3 redesign-sm:gap-5",
        "redesign-md:grid-cols-4 redesign-md:gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.productUUID}
          product={product}
          loading={false}
        />
      ))}
      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <ProductCard key={`skeleton-${i}`} loading />
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EmptyCollection                                                    */
/* ------------------------------------------------------------------ */

function EmptySearchIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className="mx-auto mb-6 opacity-40"
      aria-hidden="true"
    >
      <rect x="20" y="15" width="80" height="90" rx="8" stroke="#000" strokeWidth="1.5" />
      <path d="M40 45H80M40 60H70M40 75H60" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="85" cy="90" r="15" stroke="#000" strokeWidth="1.5" />
      <path d="M96 101L108 113" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export interface EmptyCollectionProps {
  className?: string;
}

export function EmptyCollection({ className }: EmptyCollectionProps) {
  return (
    <div
      className={cn("text-center py-20 px-6", className)}
    >
      <EmptySearchIcon />
      <h2 className="font-heading text-2xl font-bold text-black mb-2">
        No products found
      </h2>
      <p className="font-body text-[15px] text-rd-text-body mb-6">
        Try browsing a different category or check back soon.
      </p>
      <a
        href="/shop-all"
        className="inline-flex items-center justify-center h-12 px-8 bg-black text-white font-body text-sm font-semibold rounded-rd-full hover:bg-[#333] transition-colors duration-fast"
      >
        Browse All Products
      </a>
    </div>
  );
}
