import { useRef, useCallback } from "react";
import { cn } from "~/lib/utils";
import { CarouselArrows } from "~/components/v2/CarouselArrows";

export interface ReviewItem {
  id: string;
  imageSrc: string;
  reviewerName: string;
  verified?: boolean;
  reviewText: string;
  productName?: string;
  productImageSrc?: string;
  productHref?: string;
}

export interface ReviewsCarouselProps {
  title?: string;
  reviews: ReviewItem[];
  className?: string;
}

export function ReviewsCarousel({
  title = "Customer Reviews",
  reviews,
  className,
}: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => {
    trackRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    trackRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  }, []);

  return (
    <section
      className={cn(
        "mx-auto max-w-[var(--container-max)] px-12 py-20",
        "max-redesign-sm:px-4 max-redesign-sm:py-12",
        className
      )}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-heading text-[28px] font-bold text-black">
          {title}
        </h2>
        <CarouselArrows onPrev={scrollPrev} onNext={scrollNext} />
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth max-redesign-sm:gap-3"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className={cn(
              "group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white",
              "min-w-[380px] max-redesign-md:min-w-[320px] max-redesign-sm:min-w-[280px]",
              "snap-start",
              "transition-all duration-normal",
              "hover:-translate-y-0.5 hover:shadow-card-hover"
            )}
          >
            {/* Image */}
            <div className="h-[280px] w-full overflow-hidden">
              <img
                src={review.imageSrc}
                alt={`Review by ${review.reviewerName}`}
                className="h-full w-full object-cover transition-transform duration-normal group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-5 pb-4">
              <span className="inline font-body text-[15px] font-semibold text-black">
                {review.reviewerName}
              </span>
              {review.verified && (
                <span className="ml-2 font-body text-[13px] font-normal text-[#888]">
                  Verified Buyer
                </span>
              )}
              <p className="mt-3 line-clamp-3 font-body text-[14px] font-normal leading-[1.6] text-[#666]">
                {review.reviewText}
              </p>
            </div>

            {/* Product link */}
            {review.productName && (
              <a
                href={review.productHref ?? "#"}
                className="flex items-center gap-3 border-t border-[#F0F0F0] px-5 py-4 no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                {review.productImageSrc && (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={review.productImageSrc}
                      alt={review.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span className="flex-1 truncate font-body text-[13px] font-medium text-black">
                  {review.productName}
                </span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
