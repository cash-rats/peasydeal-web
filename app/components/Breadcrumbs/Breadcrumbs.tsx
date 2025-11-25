import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import type { LinksFunction } from 'react-router';

import { FiChevronRight } from 'react-icons/fi';

export type BreadcrumbItem = {
  id?: string;
  label: ReactNode;
  href?: string;
  isCurrent?: boolean;
  className?: string;
};

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
}

export const links: LinksFunction = () => {
  return [];
};

export default function BreadcrumbsNav({
  items,
}: BreadcrumbsNavProps) {
  return (
    <nav className="w-full" aria-label="Breadcrumb">
      <ol className="flex flex-row flex-wrap items-center gap-1 text-sm md:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const ariaCurrent = item.isCurrent ? 'page' : undefined;
          const content = item.href && !item.isCurrent ? (
            <NavLink
              to={item.href}
              className={`font-semibold hover:text-neutral-700 transition-colors ${item.className ?? ''}`}
            >
              {item.label}
            </NavLink>
          ) : (
            <span
              aria-current={ariaCurrent}
              className={`font-semibold ${item.isCurrent ? '!text-[#D02E7D]' : ''} ${item.className ?? ''}`}
            >
              {item.label}
            </span>
          );

          return (
            <li key={item.id ?? index} className="flex items-center">
              {content}
              {!isLast && (
                <FiChevronRight className="text-[16px] md:text-[24px] mx-1 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
