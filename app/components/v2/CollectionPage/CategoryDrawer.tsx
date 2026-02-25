import { useState } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { CategoryItem } from "./CategorySidebar";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-transform duration-fast",
        open && "rotate-180"
      )}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  CategoryDrawer (Mobile)                                            */
/* ------------------------------------------------------------------ */

export interface CategoryDrawerProps {
  categories: CategoryItem[];
  activeCategoryName?: string;
  activeLabel?: string;
}

export function CategoryDrawer({
  categories,
  activeCategoryName,
  activeLabel = "All categories",
}: CategoryDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="redesign-md:hidden mb-6">
      {/* Trigger bar */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full h-12 bg-white border border-rd-border-light rounded-rd-sm",
          "flex items-center justify-between px-4",
          "font-body text-sm font-medium text-black",
          "cursor-pointer transition-colors duration-fast",
          "hover:border-[#CCC]"
        )}
      >
        {activeLabel}
        <ChevronIcon open={open} />
      </button>

      {/* Drawer overlay + content */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] animate-[fade-in_200ms_ease]"
            onClick={() => setOpen(false)}
          />

          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[1001]",
              "bg-white rounded-t-rd-lg max-h-[70vh] overflow-y-auto",
              "p-6 pt-3",
              "animate-[slide-up_250ms_cubic-bezier(0.4,0,0.2,1)]"
            )}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-[#D9D9D9] rounded-full mx-auto mb-5" />

            <nav className="flex flex-col">
              {categories.map((cat) => {
                const isActive = cat.name === activeCategoryName;
                return (
                  <Link
                    key={cat.name}
                    to={cat.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "font-body text-sm py-3.5 border-b border-[#F0F0F0]",
                      "transition-colors duration-fast",
                      isActive
                        ? "font-semibold text-black"
                        : "text-rd-text-body hover:text-black"
                    )}
                  >
                    {cat.label}
                    {cat.count != null && (
                      <span className="text-rd-text-muted text-xs ml-2">
                        {cat.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
