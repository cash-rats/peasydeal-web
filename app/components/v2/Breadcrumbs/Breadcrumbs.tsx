import { Link } from "react-router";
import { cn } from "~/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

function ChevronSeparator() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#CCC] flex-shrink-0"
    >
      <path
        d="M3.5 1.5L7 5L3.5 8.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12 pt-4",
        className
      )}
    >
      <ol className="flex items-center gap-2 list-none m-0 p-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronSeparator />}
              {isLast || !item.href ? (
                <span className="font-body text-[13px] font-normal text-black pointer-events-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="font-body text-[13px] font-normal text-[#888] no-underline hover:text-black transition-colors duration-fast"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
