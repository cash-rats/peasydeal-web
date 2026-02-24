import { useState, useCallback } from "react";
import { cn } from "~/lib/utils";

export interface GalleryProduct {
  name: string;
  price: number;
  salePrice?: number;
  thumbnailSrc?: string;
  href: string;
}

export interface GalleryPhoto {
  imageSrc: string;
  imageAlt?: string;
  aspectRatio?: "portrait" | "square" | "wide";
  product?: GalleryProduct;
}

export interface GalleryCategory {
  label: string;
  description?: string;
  photos: GalleryPhoto[];
}

export interface LifestyleGalleryProps {
  subtitle?: string;
  heading: string;
  categories: GalleryCategory[];
  onQuickAdd?: (product: GalleryProduct) => void;
  className?: string;
}

function ShoppingBagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 5L5 1H11L12 5M4 5H12M4 5L3 14H13L12 5M6 8V6M10 8V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhotoCard({
  photo,
  onQuickAdd,
}: {
  photo: GalleryPhoto;
  onQuickAdd?: (product: GalleryProduct) => void;
}) {
  const aspectClass =
    photo.aspectRatio === "square"
      ? "aspect-square"
      : photo.aspectRatio === "wide"
      ? "aspect-[4/3]"
      : "aspect-[3/4]";

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden relative cursor-pointer group",
        aspectClass
      )}
    >
      <img
        src={photo.imageSrc}
        alt={photo.imageAlt ?? ""}
        className="w-full h-full object-cover transition-transform duration-normal group-hover:scale-[1.02]"
        loading="lazy"
      />

      {/* Product info overlay */}
      {photo.product && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition-transform duration-normal group-hover:-translate-y-1">
          {photo.product.thumbnailSrc && (
            <img
              src={photo.product.thumbnailSrc}
              alt=""
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-body text-[13px] font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">
              {photo.product.name}
            </p>
            <div className="flex items-baseline gap-1.5">
              {photo.product.salePrice != null ? (
                <>
                  <span className="font-body text-[13px] font-semibold text-[#C75050]">
                    ${photo.product.salePrice.toFixed(2)}
                  </span>
                  <span className="font-body text-xs text-[#999] line-through">
                    ${photo.product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-body text-[13px] font-semibold text-black">
                  ${photo.product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-[#E0E0E0] bg-white flex items-center justify-center flex-shrink-0 text-[#666] hover:bg-[#F5F5F5] hover:border-[#CCC] transition-all duration-fast active:scale-90"
            aria-label={`Add ${photo.product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd?.(photo.product!);
            }}
          >
            <ShoppingBagIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export function LifestyleGallery({
  subtitle,
  heading,
  categories,
  onQuickAdd,
  className,
}: LifestyleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const switchCategory = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setFading(true);
      setTimeout(() => {
        setActiveIndex(index);
        setFading(false);
      }, 150);
    },
    [activeIndex]
  );

  const activeCategory = categories[activeIndex];

  return (
    <section
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12 py-20",
        className
      )}
    >
      <div className="grid grid-cols-1 redesign-md:grid-cols-[280px_1fr] gap-12 items-start">
        {/* Left zone — text + tabs */}
        <div className="redesign-md:sticky redesign-md:top-[120px]">
          {subtitle && (
            <p className="font-body text-xs font-normal text-[#888] mb-3">
              {subtitle}
            </p>
          )}
          <h2 className="font-heading text-[32px] font-bold text-black leading-[1.2] mb-8">
            {heading}
          </h2>

          {/* Desktop: vertical category tabs */}
          <div className="hidden redesign-md:flex flex-col">
            {categories.map((cat, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={cat.label}
                  type="button"
                  className={cn(
                    "text-left py-4 pl-4 border-l-[3px] transition-all duration-fast",
                    isActive
                      ? "border-l-black"
                      : "border-l-transparent hover:border-l-[#E0E0E0]"
                  )}
                  onClick={() => switchCategory(i)}
                >
                  <p
                    className={cn(
                      "font-body text-[15px] mb-0 transition-all duration-fast",
                      isActive
                        ? "font-bold text-black"
                        : "font-normal text-[#999] hover:text-[#666]"
                    )}
                  >
                    {cat.label}
                  </p>
                  {isActive && cat.description && (
                    <p className="font-body text-[13px] font-normal text-[#666] leading-[1.5] max-w-[240px] mt-2">
                      {cat.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile: horizontal pill tabs */}
          <div className="flex redesign-md:hidden gap-2 overflow-x-auto scrollbar-none pb-2">
            {categories.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-fast flex-shrink-0",
                  i === activeIndex
                    ? "bg-black text-white"
                    : "bg-[#F5F5F5] text-[#666] hover:bg-[#E0E0E0]"
                )}
                onClick={() => switchCategory(i)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right zone — masonry photo grid */}
        <div
          className={cn(
            "transition-opacity",
            fading ? "opacity-0 duration-150" : "opacity-100 duration-slow"
          )}
        >
          <div className="grid grid-cols-1 redesign-sm:grid-cols-2 gap-5">
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              {activeCategory?.photos
                .filter((_, i) => i % 2 === 0)
                .map((photo, i) => (
                  <PhotoCard key={i} photo={photo} onQuickAdd={onQuickAdd} />
                ))}
            </div>
            {/* Column 2 (offset for masonry) */}
            <div className="flex flex-col gap-5 pt-0 redesign-md:pt-[100px]">
              {activeCategory?.photos
                .filter((_, i) => i % 2 === 1)
                .map((photo, i) => (
                  <PhotoCard key={i} photo={photo} onQuickAdd={onQuickAdd} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
