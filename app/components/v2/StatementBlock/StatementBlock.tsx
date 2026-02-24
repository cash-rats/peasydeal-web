import { cn } from "~/lib/utils";

export interface StatementBlockProps {
  /** Centered tagline above the card */
  tagline: string;
  /** Left panel subtitle (small caps text) */
  subtitle?: string;
  /** Left panel heading */
  heading: string;
  /** Left panel body text */
  body: string;
  /** Right panel image URL */
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export function StatementBlock({
  tagline,
  subtitle,
  heading,
  body,
  imageSrc,
  imageAlt = "",
  className,
}: StatementBlockProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-20",
        className
      )}
    >
      {/* Centered tagline */}
      <p
        className={cn(
          "mx-auto mb-12 max-w-[640px] text-center",
          "font-heading text-[36px] font-normal leading-[1.3] text-black"
        )}
      >
        {tagline}
      </p>

      {/* Split card */}
      <div
        className={cn(
          "grid min-h-[520px] overflow-hidden rounded-2xl",
          "grid-cols-1 redesign-md:grid-cols-2"
        )}
      >
        {/* Left panel — text */}
        <div
          className={cn(
            "flex flex-col items-center justify-center bg-[#F0EBE3] text-center",
            "px-6 py-10 redesign-md:p-16"
          )}
        >
          {subtitle && (
            <span className="mb-4 font-body text-[13px] font-medium tracking-[0.5px] text-black">
              {subtitle}
            </span>
          )}

          <h2 className="mb-5 max-w-[380px] font-heading text-[28px] font-bold leading-tight text-black">
            {heading}
          </h2>

          <p className="max-w-[380px] font-body text-[14px] font-normal leading-[1.7] text-[#666]">
            {body}
          </p>
        </div>

        {/* Right panel — image */}
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(
              "w-full object-cover",
              "h-[280px] redesign-sm:h-[360px] redesign-md:h-full"
            )}
          />
        </div>
      </div>
    </section>
  );
}
