import { cn } from "~/lib/utils";

export interface CTABannerProps {
  subtitle?: string;
  heading: string;
  body?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  imageSrc: string;
  imageAlt?: string;
  /** Reverse layout (image left, text right) */
  reversed?: boolean;
  className?: string;
}

export function CTABanner({
  subtitle,
  heading,
  body,
  ctaLabel,
  onCtaClick,
  ctaHref,
  imageSrc,
  imageAlt = "",
  reversed = false,
  className,
}: CTABannerProps) {
  const CtaTag = ctaHref ? "a" : "button";
  const ctaProps = ctaHref
    ? { href: ctaHref }
    : { type: "button" as const, onClick: onCtaClick };

  const textPanel = (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-[#F0EBE3] text-center",
        "p-10 px-6 redesign-md:p-16"
      )}
    >
      {subtitle && (
        <span className="mb-3 font-body text-[13px] font-normal tracking-[0.5px] text-[#888]">
          {subtitle}
        </span>
      )}

      <h2 className="mb-4 max-w-[340px] font-heading text-[36px] font-bold leading-[1.2] text-black">
        {heading}
      </h2>

      {body && (
        <p className="mb-6 max-w-[340px] font-body text-[14px] font-normal leading-[1.6] text-[#666]">
          {body}
        </p>
      )}

      {ctaLabel && (
        <CtaTag
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-black px-7 py-3",
            "font-body text-[13px] font-medium text-white no-underline",
            "transition-colors duration-fast hover:bg-[#333]",
            "border-none cursor-pointer"
          )}
          {...ctaProps}
        >
          {ctaLabel}
        </CtaTag>
      )}
    </div>
  );

  const imagePanel = (
    <div className="relative overflow-hidden">
      <img
        src={imageSrc}
        alt={imageAlt}
        className={cn(
          "w-full object-cover",
          "h-[260px] redesign-sm:h-[320px] redesign-md:h-full"
        )}
      />
    </div>
  );

  return (
    <section
      className={cn(
        "mx-auto max-w-[var(--container-max)] px-12",
        "max-redesign-sm:px-0",
        className
      )}
    >
      <div
        className={cn(
          "grid overflow-hidden",
          "grid-cols-1 redesign-md:grid-cols-2",
          "rounded-2xl redesign-md:min-h-[420px]",
          "max-redesign-sm:rounded-none"
        )}
      >
        {reversed ? (
          <>
            {imagePanel}
            {textPanel}
          </>
        ) : (
          <>
            {textPanel}
            {imagePanel}
          </>
        )}
      </div>
    </section>
  );
}
