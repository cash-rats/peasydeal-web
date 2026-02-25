import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "~/lib/utils";

export interface HeroSlide {
  imageSrc: string;
  imageAlt?: string;
  bgTint?: string;
  subtitle?: string;
  headline: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function HeroCarousel({
  slides,
  autoPlay = true,
  interval = 5000,
  pauseOnHover = true,
  className,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || paused || total <= 1) return;
    timerRef.current = setTimeout(next, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoPlay, paused, active, interval, next, total]);

  const prevIndex = ((active - 1) % total + total) % total;
  const nextIndex = (active + 1) % total;

  return (
    <section
      className={cn("w-full relative overflow-hidden", className)}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      {/* Desktop 3-panel layout */}
      <div className="hidden redesign-md:block relative" style={{ height: 580 }}>
        {/* Left peek */}
        <div className="absolute left-0 top-0 bottom-0 w-[160px] overflow-hidden">
          <img
            src={slides[prevIndex].imageSrc}
            alt=""
            className="w-full h-full object-cover brightness-95"
          />
        </div>

        {/* Center panel */}
        <div
          className="absolute top-0 bottom-0 left-[168px] right-[168px] rounded-2xl overflow-hidden"
          style={{ backgroundColor: slides[active].bgTint ?? "#D4A99A" }}
        >
          <img
            src={slides[active].imageSrc}
            alt={slides[active].imageAlt ?? ""}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-slow"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-black/30 z-[1]" />
          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-12 z-10">
            {slides[active].subtitle && (
              <p className="font-body text-sm font-normal text-white/80 mb-3 tracking-wider">
                {slides[active].subtitle}
              </p>
            )}
            <h2 className="font-heading text-[48px] font-normal text-white leading-[1.15] mb-7 max-w-[500px] italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {slides[active].headline}
            </h2>
            {slides[active].ctaLabel && (
              <a
                href={slides[active].ctaHref ?? "#"}
                className="inline-flex items-center px-9 py-3.5 bg-white text-black font-body text-sm font-medium rounded-full border-none no-underline hover:bg-[#F0F0F0] transition-colors duration-fast"
              >
                {slides[active].ctaLabel}
              </a>
            )}
          </div>
        </div>

        {/* Right peek */}
        <div className="absolute right-0 top-0 bottom-0 w-[160px] overflow-hidden">
          <img
            src={slides[nextIndex].imageSrc}
            alt=""
            className="w-full h-full object-cover brightness-95"
          />
        </div>
      </div>

      {/* Tablet layout (640-1023) */}
      <div className="hidden redesign-sm:block redesign-md:hidden mx-6" style={{ height: 480 }}>
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <img
            src={slides[active].imageSrc}
            alt={slides[active].imageAlt ?? ""}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 z-[1]" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 z-10">
            {slides[active].subtitle && (
              <p className="font-body text-sm text-white/80 mb-3">{slides[active].subtitle}</p>
            )}
            <h2 className="font-heading text-[40px] font-normal text-white leading-[1.15] mb-6 max-w-[440px] italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {slides[active].headline}
            </h2>
            {slides[active].ctaLabel && (
              <a
                href={slides[active].ctaHref ?? "#"}
                className="inline-flex px-8 py-3 bg-white text-black font-body text-sm font-medium rounded-full no-underline hover:bg-[#F0F0F0] transition-colors duration-fast"
              >
                {slides[active].ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="block redesign-sm:hidden relative" style={{ height: 400 }}>
        <img
          src={slides[active].imageSrc}
          alt={slides[active].imageAlt ?? ""}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
          <h2 className="font-heading text-[32px] font-normal text-white leading-[1.15] mb-5 italic">
            {slides[active].headline}
          </h2>
          {slides[active].ctaLabel && (
            <a
              href={slides[active].ctaHref ?? "#"}
              className="inline-flex px-8 py-3 bg-white text-black font-body text-sm font-medium rounded-full no-underline hover:bg-[#F0F0F0] transition-colors duration-fast"
            >
              {slides[active].ctaLabel}
            </a>
          )}
        </div>
      </div>

      {/* Dot pagination */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full border-none cursor-pointer transition-all duration-normal",
                i === active
                  ? "w-8 bg-black"
                  : "w-2 bg-[#CCC] hover:bg-[#999]"
              )}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
