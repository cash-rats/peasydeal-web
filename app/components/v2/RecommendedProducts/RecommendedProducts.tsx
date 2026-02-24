import { cn } from "~/lib/utils";
import { ProductCard } from "~/components/v2/ProductCard";
import type { Product } from "~/shared/types";

export interface RecommendedProductsProps {
  title?: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function RecommendedProducts({
  title = "You may also like",
  products,
  onProductClick,
  onAddToCart,
  className,
}: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12 py-16 border-t border-[#E0E0E0]",
        className
      )}
    >
      <h2 className="font-heading text-[28px] font-bold text-black text-center mb-10">
        {title}
      </h2>
      <div className="grid grid-cols-2 redesign-sm:grid-cols-3 redesign-md:grid-cols-4 gap-3 redesign-md:gap-4">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard
            key={product.productUUID ?? i}
            product={product}
            bordered
            onClick={onProductClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
