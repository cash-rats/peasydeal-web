import { useRef, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export interface TaglineBannerProps {
  headline: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function TaglineBanner({
  headline,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className,
}: TaglineBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn("w-full bg-white text-center py-20 px-12", className)}
    >
      <h2
        className="font-heading text-[40px] font-normal text-black leading-[1.3] max-w-[640px] mx-auto mb-6"
      >
        {headline}
      </h2>
      {ctaLabel && (
        <a
          href={ctaHref ?? "#"}
          onClick={onCtaClick ? (e) => { e.preventDefault(); onCtaClick(); } : undefined}
          className="relative inline-block font-body text-sm font-medium text-black no-underline pb-1"
        >
          {ctaLabel}
          <span
            className={cn(
              "absolute bottom-0 left-[-4px] right-[-4px] h-[2px] bg-black",
              "origin-left transition-transform duration-normal",
              visible ? "scale-x-100" : "scale-x-0"
            )}
          />
        </a>
      )}
    </section>
  );
}
