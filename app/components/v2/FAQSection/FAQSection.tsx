import { useState, useCallback } from "react";
import { cn } from "~/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  heading: string;
  body?: string;
  secondaryText?: string;
  contactLink?: { label: string; href: string };
  ctaLabel?: string;
  onCtaClick?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  items: FAQItem[];
  className?: string;
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FAQSection({
  heading,
  body,
  secondaryText,
  contactLink,
  ctaLabel,
  onCtaClick,
  imageSrc,
  imageAlt = "",
  items,
  className,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback(
    (index: number) => {
      setOpenIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  return (
    <section
      className={cn(
        "w-full bg-[#F0EBE3] px-12 py-20",
        "max-redesign-sm:px-4 max-redesign-sm:py-12",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[var(--container-max)]",
          "grid items-start gap-12",
          "grid-cols-1 redesign-sm:grid-cols-[1fr_1fr] redesign-md:grid-cols-[280px_1fr_1fr]"
        )}
      >
        {/* Column 1 — Intro */}
        <div className="redesign-sm:col-span-2 redesign-md:col-span-1">
          <h2 className="mb-4 font-heading text-[28px] font-black leading-[1.2] text-black">
            {heading}
          </h2>

          {body && (
            <p className="mb-2 font-body text-[14px] font-normal leading-[1.6] text-[#666]">
              {body}
            </p>
          )}

          {secondaryText && (
            <p className="mb-6 font-body text-[14px] font-normal text-[#666]">
              {secondaryText}
              {contactLink && (
                <>
                  {" "}
                  <a
                    href={contactLink.href}
                    className="font-medium text-black underline"
                  >
                    {contactLink.label}
                  </a>
                </>
              )}
            </p>
          )}

          {ctaLabel && (
            <button
              type="button"
              className={cn(
                "rounded-full bg-black px-7 py-3",
                "font-body text-[13px] font-medium text-white",
                "transition-colors duration-fast hover:bg-[#333]"
              )}
              onClick={onCtaClick}
            >
              {ctaLabel}
            </button>
          )}
        </div>

        {/* Column 2 — Image */}
        {imageSrc && (
          <div className="flex items-center justify-center max-redesign-sm:hidden">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="max-h-[480px] max-w-full object-contain"
            />
          </div>
        )}

        {/* Column 3 — Accordion */}
        <div className="flex flex-col gap-2">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "overflow-hidden rounded-xl bg-white",
                  "transition-shadow duration-fast hover:shadow-card-hover"
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between border-none bg-transparent px-5 py-[18px] text-left cursor-pointer"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 font-body text-[15px] font-medium text-black">
                    {item.question}
                  </span>
                  <PlusIcon
                    className={cn(
                      "ml-3 h-5 w-5 shrink-0 text-black transition-transform duration-fast",
                      isOpen && "rotate-45"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-slow",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-[18px] font-body text-[14px] font-normal leading-[1.6] text-[#666]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
