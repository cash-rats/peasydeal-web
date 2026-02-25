import { Link } from "react-router";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  BlogPagination                                                     */
/* ------------------------------------------------------------------ */

export interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  className,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={cn(
        "flex items-center justify-center gap-2 mt-12",
        className
      )}
      aria-label="Blog pagination"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          to={currentPage === 2 ? "/blog" : `/blog/page/${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-rd-sm border border-rd-border-light text-rd-text-body hover:bg-[#F9F9F9] hover:border-[#CCC] transition-all duration-fast"
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span className="w-10 h-10 flex items-center justify-center rounded-rd-sm border border-rd-border-light opacity-30 pointer-events-none">
          <ChevronLeftIcon />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        const href = page === 1 ? "/blog" : `/blog/page/${page}`;

        return isActive ? (
          <span
            key={page}
            className="w-10 h-10 flex items-center justify-center rounded-rd-sm bg-black text-white font-body text-sm font-medium"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            to={href}
            className="w-10 h-10 flex items-center justify-center rounded-rd-sm border border-rd-border-light font-body text-sm font-medium text-rd-text-body hover:bg-[#F9F9F9] hover:border-[#CCC] transition-all duration-fast"
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          to={`/blog/page/${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-rd-sm border border-rd-border-light text-rd-text-body hover:bg-[#F9F9F9] hover:border-[#CCC] transition-all duration-fast"
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </Link>
      ) : (
        <span className="w-10 h-10 flex items-center justify-center rounded-rd-sm border border-rd-border-light opacity-30 pointer-events-none">
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  );
}
