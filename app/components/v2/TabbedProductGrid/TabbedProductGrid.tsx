import { useState, useCallback } from "react";
import { cn } from "~/lib/utils";
import { ProductCard } from "~/components/v2/ProductCard";
import type { Product } from "~/shared/types";

export interface ProductTab {
  label: string;
  products: Product[];
}

export interface TabbedProductGridProps {
  tabs: ProductTab[];
  shopAllLabel?: string;
  shopAllHref?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function TabbedProductGrid({
  tabs,
  shopAllLabel = "Shop All Products",
  shopAllHref = "/shop",
  onProductClick,
  onAddToCart,
  className,
}: TabbedProductGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

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
          href={shopAllHref}
          className="font-body text-sm font-medium text-black underline underline-offset-4 decoration-[1.5px]"
        >
          {shopAllLabel}
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
        {activeTab?.products.slice(0, 8).map((product, i) => (
          <ProductCard
            key={product.productUUID ?? i}
            product={product}
            onClick={onProductClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
