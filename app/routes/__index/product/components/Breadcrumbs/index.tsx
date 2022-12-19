import type { ReactNode } from 'react';
import { NavLink } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs/Breadcrumbs';

type ProductDetailBreadcrumbsProps = {
  categoryTitle?: ReactNode;
  productTitle?: ReactNode;
  productUuid?: string;
}

export const links: LinksFunction = () => {
  return [
    ...BreadCrumbsLinks(),
  ];
};

export default function ProductDetailBreadcrumbs({ categoryTitle, productTitle, productUuid }: ProductDetailBreadcrumbsProps) {
  return (
    <div className="
    px-4 mx-auto max-w-[1060px]
    1280:max-w-[1416px] 1280:pl-8"
    >
      <Breadcrumbs
        breadcrumbs={[
          <NavLink
            className={({ isActive }) => (
              isActive
                ? "font-medium text-base cursor-pointer capitalize hover:underline"
                : "text-sm font-bold no-underline text-raisin-black"
            )}
            to='/'
            key='1'
          > Home </NavLink>,

          categoryTitle && (
            <NavLink
              className={({ isActive }) => (
                isActive
                  ? "font-medium text-base cursor-pointer capitalize hover:underline"
                  : "text-sm font-bold no-underline text-raisin-black"
              )}
              to={`/${categoryTitle}`}
              key='2'
            > {categoryTitle} </NavLink>
          ),

          productTitle && (
            <NavLink
              className={({ isActive }) => (
                isActive
                  ? "font-medium text-base cursor-pointer capitalize hover:underline"
                  : "text-sm font-bold no-underline text-raisin-black"
              )}
              to={`/product/${productUuid}`}
              key='2'
            > {productTitle}
            </NavLink>
          )
        ]}
      />
    </div>
  )
}