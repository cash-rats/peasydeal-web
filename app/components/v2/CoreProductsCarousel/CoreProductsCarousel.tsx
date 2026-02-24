import { useRef, useCallback } from "react";
import { cn } from "~/lib/utils";
import { CarouselArrows } from "~/components/v2/CarouselArrows";

export interface CoreProduct {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  category?: string;
  name: string;
  description?: string;
  salePrice?: number;
  retailPrice: number;
  ctaLabel?: string;
  href: string;
}

export interface CoreProductsCarouselProps {
  title: string;
  products: CoreProduct[];
  className?: string;
}

export function CoreProductsCarousel({
  title,
  products,
  className,
}: CoreProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "prev" | "next") => {
    trackRef.current?.scrollBy({
      left: dir === "next" ? 760 : -760,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12 py-20",
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-heading text-[28px] font-bold text-black">
          {title}
        </h2>
        <CarouselArrows onPrev={() => scroll("prev")} onNext={() => scroll("next")} />
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={cn(
              "flex-shrink-0 snap-start",
              /* Desktop: card pair grid */
              "grid grid-cols-1 redesign-md:grid-cols-[440px_1fr] gap-8 items-center",
              "min-w-[280px] redesign-md:min-w-[720px]"
            )}
          >
            {/* Image column */}
            <div className="w-full redesign-md:w-[440px] h-[300px] redesign-md:h-[480px] bg-[#F5F5F5] rounded-2xl flex items-center justify-center overflow-hidden group">
              <img
                src={product.imageSrc}
                alt={product.imageAlt ?? product.name}
                className="max-w-[75%] max-h-[75%] object-contain transition-transform duration-normal group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            {/* Text column */}
            <div className="flex flex-col justify-center py-4">
              {product.category && (
                <p className="font-body text-[13px] font-normal text-[#888] mb-2">
                  {product.category}
                </p>
              )}
              <h3 className="font-heading text-[24px] redesign-md:text-[32px] font-bold text-black leading-[1.2] mb-3 max-w-[280px] line-clamp-3">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                {product.salePrice != null ? (
                  <>
                    <span className="font-body text-base font-semibold text-[#C75050]">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="font-body text-sm font-normal text-[#999] line-through">
                      ${product.retailPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-body text-base font-semibold text-black">
                    ${product.retailPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="font-body text-sm font-normal text-[#666] leading-[1.6] mb-6 max-w-[320px] line-clamp-3">
                  {product.description}
                </p>
              )}
              <a
                href={product.href}
                className="inline-flex items-center px-8 py-3.5 bg-black text-white font-body text-sm font-medium rounded-full w-fit no-underline hover:bg-[#333] transition-colors duration-fast"
              >
                {product.ctaLabel ?? "Shop Now"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
