import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "~/lib/utils";

export interface ProductImageGalleryProps {
  images: string[];
  previewImage?: string;
  selectedVariationImage?: string;
  productName?: string;
  onZoom?: (index: number) => void;
  className?: string;
}

function ZoomIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 8H10M8 6V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ProductImageGallery({
  images,
  previewImage,
  selectedVariationImage,
  productName = "Product",
  onZoom,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedVariationImage) return;
    const selectedIndex = images.indexOf(selectedVariationImage);
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
    }
  }, [images, selectedVariationImage]);

  const mainImage = previewImage ?? selectedVariationImage ?? images[activeIndex] ?? images[0];
  const displayIndex = images.indexOf(mainImage);
  const imageOrdinal = displayIndex >= 0 ? displayIndex + 1 : activeIndex + 1;

  const handleMobileScroll = useCallback(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const width = el.clientWidth;
    const idx = Math.round(scrollLeft / width);
    setActiveIndex(idx);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Desktop: main image + thumbnail grid */}
      <div className="hidden redesign-sm:flex flex-col gap-2 sticky top-[88px]">
        {/* Main image */}
        <div className="relative w-full aspect-[3/4] bg-[#F5F5F5] rounded-2xl overflow-hidden">
          <img
            src={mainImage}
            alt={`${productName} - Image ${imageOrdinal}`}
            className="w-full h-full object-cover"
          />
          {onZoom && (
            <button
              type="button"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex items-center justify-center text-black hover:bg-[#F5F5F5] transition-colors duration-fast"
              aria-label="Zoom image"
              onClick={() => onZoom(activeIndex)}
            >
              <ZoomIcon />
            </button>
          )}
        </div>

        {/* Thumbnail grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {images.slice(0, 4).map((src, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors duration-fast",
                  i === activeIndex
                    ? "border-black"
                    : "border-transparent hover:border-[#CCC]"
                )}
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`${productName} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Additional full-width images below thumbnails */}
        {images.slice(4).map((src, i) => (
          <div key={i + 4} className="w-full rounded-xl overflow-hidden">
            <img
              src={src}
              alt={`${productName} - Image ${i + 5}`}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Mobile: horizontal swipe carousel */}
      <div className="block redesign-sm:hidden">
        <div
          ref={mobileTrackRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          onScroll={handleMobileScroll}
        >
          {images.map((src, i) => (
            <div key={i} className="min-w-full snap-center flex-shrink-0">
              <div className="aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                <img
                  src={src}
                  alt={`${productName} - Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "h-2 rounded-full border-none transition-all duration-normal",
                  i === activeIndex
                    ? "w-8 bg-black"
                    : "w-2 bg-[#CCC] hover:bg-[#999]"
                )}
                onClick={() => {
                  setActiveIndex(i);
                  mobileTrackRef.current?.scrollTo({
                    left: i * (mobileTrackRef.current?.clientWidth ?? 0),
                    behavior: "smooth",
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
