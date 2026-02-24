import { useRef, useCallback } from "react";
import { cn } from "~/lib/utils";
import { CarouselArrows } from "~/components/v2/CarouselArrows";
import type { ProductCardProps } from "~/components/v2/ProductCard";
import { ProductCard } from "~/components/v2/ProductCard";
import type { Product } from "~/shared/types";

export interface CampaignCardData {
  categoryLabel?: string;
  headline: string;
  ctaLabel: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface ProductCarouselRow {
  title: string;
  products: Product[];
}

export interface CampaignSectionProps {
  campaign: CampaignCardData;
  rows: ProductCarouselRow[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

function ProductRowCarousel({
  title,
  products,
  onProductClick,
  onAddToCart,
}: {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "prev" | "next") => {
    trackRef.current?.scrollBy({
      left: dir === "next" ? 280 : -280,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      {/* Row header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-heading text-[28px] font-bold text-black">
          {title}
        </h3>
        <CarouselArrows onPrev={() => scroll("prev")} onNext={() => scroll("next")} />
      </div>

      {/* Product cards track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none"
      >
        {products.map((product, i) => (
          <div key={product.productUUID ?? i} className="min-w-[260px] flex-shrink-0 snap-start">
            <ProductCard
              product={product}
              onClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CampaignSection({
  campaign,
  rows,
  onProductClick,
  onAddToCart,
  className,
}: CampaignSectionProps) {
  return (
    <section
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12",
        className
      )}
    >
      <div className="grid grid-cols-1 redesign-md:grid-cols-[420px_1fr] gap-8">
        {/* Left — Campaign lifestyle card */}
        <a
          href={campaign.ctaHref ?? "#"}
          className={cn(
            "relative rounded-2xl overflow-hidden no-underline block",
            "h-[280px] redesign-md:h-full redesign-md:min-h-[680px]",
            "group"
          )}
        >
          <img
            src={campaign.imageSrc}
            alt={campaign.imageAlt ?? ""}
            className="absolute inset-0 w-full h-full object-cover animate-[kenburns_20s_ease_infinite_alternate]"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/35" />
          {/* Content overlay */}
          <div className="absolute top-0 left-0 z-[1] p-8 redesign-md:p-10">
            {campaign.categoryLabel && (
              <p className="font-body text-xs font-normal text-white/80 mb-2">
                {campaign.categoryLabel}
              </p>
            )}
            <h2 className="font-heading text-[32px] font-bold text-white leading-[1.2] mb-5">
              {campaign.headline}
            </h2>
            <span className="inline-flex items-center px-7 py-3 bg-white text-black font-body text-[13px] font-medium rounded-full group-hover:bg-[#F0F0F0] transition-colors duration-fast">
              {campaign.ctaLabel}
            </span>
          </div>
        </a>

        {/* Right — Stacked product carousel rows */}
        <div className="flex flex-col gap-12">
          {rows.map((row, i) => (
            <ProductRowCarousel
              key={i}
              title={row.title}
              products={row.products}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
