import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

export interface MobileNavCategory {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MobileNavCategory[];
  className?: string;
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  categories,
  className,
}: MobileNavDrawerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[1100] bg-black/40 transition-opacity duration-normal",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-[1101] h-full w-full max-w-[360px]",
          "bg-white overflow-y-auto",
          "transform transition-transform duration-slow ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4">
          <button
            type="button"
            className="bg-transparent border-none cursor-pointer p-1 text-black"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col px-6 pb-8">
          {categories.map((cat, index) => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isExpanded = openIndex === index;

            return (
              <div key={index} className="border-b border-[#F0F0F0]">
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between py-4",
                        "bg-transparent border-none cursor-pointer text-left",
                        "font-body text-[16px] font-semibold text-black"
                      )}
                      onClick={() => toggle(index)}
                      aria-expanded={isExpanded}
                    >
                      {cat.label}
                      <ChevronDownIcon
                        className={cn(
                          "transition-transform duration-fast text-[#888]",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid transition-all duration-slow",
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-3 pb-4 pl-4">
                          {cat.children!.map((child, ci) => (
                            <Link
                              key={ci}
                              to={child.href}
                              className="font-body text-[14px] font-normal text-[#666] no-underline hover:text-black transition-colors duration-fast"
                              onClick={onClose}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={cat.href ?? "#"}
                    className="block py-4 font-body text-[16px] font-semibold text-black no-underline"
                    onClick={onClose}
                  >
                    {cat.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
