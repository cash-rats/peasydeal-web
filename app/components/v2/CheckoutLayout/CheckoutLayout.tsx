import { useState } from "react";
import { cn } from "~/lib/utils";

export type CheckoutStep = "information" | "shipping" | "payment";

export interface CheckoutLayoutProps {
  storeName?: string;
  storeHref?: string;
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  className?: string;
}

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "information", label: "Information" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
];

function getStepIndex(step: CheckoutStep) {
  return STEPS.findIndex((s) => s.key === step);
}

export function CheckoutLayout({
  storeName = "PeasyDeal",
  storeHref = "/",
  currentStep,
  onStepClick,
  leftContent,
  rightContent,
  className,
}: CheckoutLayoutProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const currentIdx = getStepIndex(currentStep);

  return (
    <div className={cn("min-h-screen flex flex-col bg-white", className)}>
      <div className="max-w-[1160px] mx-auto w-full flex-1 grid grid-cols-1 redesign-md:grid-cols-[1fr_420px] gap-0">
        {/* Left column */}
        <div className="redesign-md:border-r redesign-md:border-[#E0E0E0] redesign-md:min-h-screen px-4 py-6 redesign-sm:px-8 redesign-sm:py-8 redesign-md:py-12 redesign-md:pl-12 redesign-md:pr-16">
          {/* Store logo / name */}
          <a
            href={storeHref}
            className="block font-heading text-2xl font-black text-black no-underline mb-6"
          >
            {storeName}
          </a>

          {/* Breadcrumb steps */}
          <nav className="flex items-center gap-2 mb-8 flex-wrap">
            <a
              href="/cart"
              className="font-body text-[13px] text-[#1A73E8] no-underline hover:underline"
            >
              Cart
            </a>
            {STEPS.map((step, idx) => {
              const isActive = idx === currentIdx;
              const isCompleted = idx < currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <span key={step.key} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#CCC]">&gt;</span>
                  {isCompleted ? (
                    <button
                      type="button"
                      onClick={() => onStepClick?.(step.key)}
                      className="font-body text-[13px] text-[#1A73E8] bg-transparent border-none p-0 cursor-pointer hover:underline"
                    >
                      {step.label}
                    </button>
                  ) : isActive ? (
                    <span className="font-body text-[13px] font-semibold text-black">
                      {step.label}
                    </span>
                  ) : (
                    <span className="font-body text-[13px] text-[#999] cursor-default">
                      {step.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>

          {/* Mobile order summary toggle */}
          <div className="redesign-md:hidden mb-6">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="w-full flex justify-between items-center py-4 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg px-4 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <CartIcon />
                <span className="font-body text-sm text-[#1A73E8]">
                  {summaryOpen ? "Hide order summary" : "Show order summary"}
                </span>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  className={cn(
                    "transition-transform duration-fast",
                    summaryOpen && "rotate-180"
                  )}
                >
                  <path d="M1 1L5 5L9 1" stroke="#1A73E8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {summaryOpen && (
              <div className="bg-[#FAFAFA] border-x border-b border-[#E0E0E0] rounded-b-lg px-4 pb-4 -mt-px">
                {rightContent}
              </div>
            )}
          </div>

          {/* Left content */}
          {leftContent}
        </div>

        {/* Right column (desktop only) */}
        <div className="hidden redesign-md:block bg-[#FAFAFA] min-h-screen py-12 pl-10 pr-12">
          {rightContent}
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 16.5C6.41 16.5 6.75 16.16 6.75 15.75C6.75 15.34 6.41 15 6 15C5.59 15 5.25 15.34 5.25 15.75C5.25 16.16 5.59 16.5 6 16.5Z" stroke="#1A73E8" strokeWidth="1.2" />
      <path d="M13.5 16.5C13.91 16.5 14.25 16.16 14.25 15.75C14.25 15.34 13.91 15 13.5 15C13.09 15 12.75 15.34 12.75 15.75C12.75 16.16 13.09 16.5 13.5 16.5Z" stroke="#1A73E8" strokeWidth="1.2" />
      <path d="M1.5 1.5H3.75L5.67 10.76C5.74 11.09 6.03 11.33 6.37 11.33H13.29C13.63 11.33 13.91 11.1 13.99 10.78L15.37 5.25H4.5" stroke="#1A73E8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
