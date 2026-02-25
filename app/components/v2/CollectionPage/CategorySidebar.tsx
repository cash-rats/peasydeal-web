import { Link } from "react-router";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function BackArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CategoryItem {
  name: string;
  label: string;
  count?: number;
  href: string;
}

export interface CategorySidebarProps {
  parentLabel?: string;
  parentHref?: string;
  categories: CategoryItem[];
  activeCategoryName?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  CategorySidebar (Desktop)                                          */
/* ------------------------------------------------------------------ */

export function CategorySidebar({
  parentLabel,
  parentHref,
  categories,
  activeCategoryName,
  className,
}: CategorySidebarProps) {
  return (
    <aside
      className={cn(
        "w-[240px] sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto",
        "pr-6 border-r border-rd-border-light",
        "scrollbar-none",
        "hidden redesign-md:block",
        className
      )}
    >
      {/* Back to parent */}
      {parentHref && (
        <Link
          to={parentHref}
          className="flex items-center gap-1.5 font-body text-[13px] text-rd-text-secondary hover:text-black transition-colors duration-fast mb-4"
        >
          <BackArrowIcon />
          Back to {parentLabel || "all"}
        </Link>
      )}

      {/* Parent category title */}
      {parentLabel && (
        <h2 className="font-heading text-xl font-bold text-black mb-5">
          {parentLabel}
        </h2>
      )}

      {/* Child category links */}
      <nav className="flex flex-col">
        {categories.map((cat) => {
          const isActive = cat.name === activeCategoryName;
          return (
            <Link
              key={cat.name}
              to={cat.href}
              className={cn(
                "font-body text-sm text-rd-text-body py-2.5 border-b border-[#F0F0F0]",
                "transition-all duration-fast",
                "hover:text-black hover:pl-1",
                isActive &&
                  "font-semibold text-black border-l-2 border-l-black pl-3"
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
    </aside>
  );
}
