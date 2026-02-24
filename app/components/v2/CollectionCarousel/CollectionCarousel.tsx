import { useRef, useCallback } from "react";
import { cn } from "~/lib/utils";
import { CarouselArrows } from "~/components/v2/CarouselArrows";

export interface CollectionItem {
  id: string;
  imageSrc: string;
  name: string;
  itemCount?: number;
  href?: string;
}

export interface CollectionCarouselProps {
  subtitle?: string;
  heading: string;
  body?: string;
  collections: CollectionItem[];
  className?: string;
}

function DiagonalArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 10L10 4M10 4H5M10 4V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CollectionCarousel({
  subtitle,
  heading,
  body,
  collections,
  className,
}: CollectionCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => {
    trackRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    trackRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  }, []);

  return (
    <section
      className={cn(
        "mx-auto max-w-[var(--container-max)] bg-[#F0EBE3] px-12 py-20",
        "max-redesign-sm:px-4 max-redesign-sm:py-12",
        className
      )}
    >
      <div
        className={cn(
          "grid items-center gap-12",
          "grid-cols-1 redesign-md:grid-cols-[320px_1fr]"
        )}
      >
        {/* Left — Intro */}
        <div>
          {subtitle && (
            <span className="mb-3 block font-body text-[13px] font-medium tracking-[0.5px] text-black">
              {subtitle}
            </span>
          )}

          <h2 className="mb-4 font-heading text-[32px] font-bold leading-[1.2] text-black">
            {heading}
          </h2>

          {body && (
            <p className="mb-8 font-body text-[14px] font-normal leading-[1.6] text-[#666]">
              {body}
            </p>
          )}

          <CarouselArrows onPrev={scrollPrev} onNext={scrollNext} />
        </div>

        {/* Right — Carousel */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {collections.map((collection) => {
            const Wrapper = collection.href ? "a" : "div";
            const wrapperProps = collection.href
              ? { href: collection.href, className: "no-underline" }
              : {};

            return (
              <Wrapper
                key={collection.id}
                {...wrapperProps}
              >
                <div
                  className={cn(
                    "group shrink-0 snap-start overflow-hidden rounded-2xl bg-white cursor-pointer",
                    "min-w-[340px] max-redesign-sm:min-w-[260px]",
                    "transition-all duration-normal",
                    "hover:-translate-y-0.5 hover:shadow-card-hover"
                  )}
                >
                  {/* Image */}
                  <div className="h-[280px] w-full overflow-hidden">
                    <img
                      src={collection.imageSrc}
                      alt={collection.name}
                      className="h-full w-full object-cover transition-transform duration-normal group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  {/* Info bar */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-body text-[16px] font-semibold text-black">
                        {collection.name}
                      </span>
                      {collection.itemCount != null && (
                        <span className="mt-0.5 font-body text-[13px] font-normal text-[#888]">
                          {collection.itemCount} items
                        </span>
                      )}
                    </div>

                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        "border border-[#E0E0E0] bg-white text-black",
                        "transition-all duration-fast",
                        "group-hover:border-[#CCC] group-hover:bg-[#F5F5F5]"
                      )}
                    >
                      <DiagonalArrowIcon />
                    </span>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
