import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "~/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface ProductImageGalleryProps {
  images: string[];
  thumbnailImages?: string[];
  detailImages?: string[];
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
  thumbnailImages,
  detailImages,
  previewImage,
  selectedVariationImage,
  productName = "Product",
  onZoom,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedVariationImage) return;
    const selectedIndex = images.indexOf(selectedVariationImage);
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
      // Keep mobile carousel viewport in sync when variant changes.
      window.requestAnimationFrame(() => {
        const track = mobileTrackRef.current;
        if (!track) return;
        const width = track.clientWidth;
        if (!width) return;
        track.scrollTo({
          left: selectedIndex * width,
          behavior: "smooth",
        });
      });
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

  const openAtIndex = useCallback((idx: number) => {
    const safeIndex = idx >= 0 ? idx : 0;
    setLightboxIndex(safeIndex);
    setOpenLightbox(true);
  }, []);

  if (images.length === 0) return null;

  const upperThumbnailImages = thumbnailImages ?? images.slice(0, 4);
  const lowerSectionImages = detailImages ?? images.slice(4);
  const currentMainIndex = displayIndex >= 0 ? displayIndex : activeIndex;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        index={lightboxIndex}
        slides={images.map((src) => ({ src }))}
      />

      {/* Desktop: main image + thumbnail grid */}
      <div className="hidden redesign-sm:flex flex-col gap-2 sticky top-[88px]">
        {/* Main image */}
        <div className="relative w-full aspect-[3/4] bg-[#F5F5F5] rounded-2xl overflow-hidden">
          <img
            src={mainImage}
            alt={`${productName} - Image ${imageOrdinal}`}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => openAtIndex(currentMainIndex)}
          />
          {onZoom && (
            <button
              type="button"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex items-center justify-center text-black hover:bg-[#F5F5F5] transition-colors duration-fast"
              aria-label="Zoom image"
              onClick={() => {
                onZoom(activeIndex);
                openAtIndex(currentMainIndex);
              }}
            >
              <ZoomIcon />
            </button>
          )}
        </div>

        {/* Thumbnail grid */}
        {upperThumbnailImages.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {upperThumbnailImages.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors duration-fast",
                  src === (images[activeIndex] ?? images[0])
                    ? "border-black"
                    : "border-transparent hover:border-[#CCC]"
                )}
                onClick={() => {
                  const mappedIndex = images.indexOf(src);
                  if (mappedIndex >= 0) {
                    setActiveIndex(mappedIndex);
                    openAtIndex(mappedIndex);
                  }
                }}
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
        {lowerSectionImages.map((src, i) => (
          <div key={`${src}-${i}`} className="w-full rounded-xl overflow-hidden">
            <img
              src={src}
              alt={`${productName} - Image`}
              className="w-full object-cover cursor-zoom-in"
              loading="lazy"
              onClick={() => {
                const mappedIndex = images.indexOf(src);
                if (mappedIndex >= 0) {
                  openAtIndex(mappedIndex);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Mobile: horizontal swipe carousel */}
      <div className="block redesign-sm:hidden">
        <div
          ref={mobileTrackRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          onScroll={handleMobileScroll}
        >
          {images.map((src, i) => (
            <div key={i} className="w-full min-w-full basis-full snap-center shrink-0">
              <div className="w-full h-[68vh] min-h-[280px] max-h-[520px] bg-[#F5F5F5] overflow-hidden rounded-2xl flex items-center justify-center">
                <img
                  src={src}
                  alt={`${productName} - Image ${i + 1}`}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => openAtIndex(i)}
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
