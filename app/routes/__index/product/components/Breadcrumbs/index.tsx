import type { ReactNode } from 'react';
import { NavLink } from '@remix-run/react';

import { composeProductDetailURL } from '~/utils';
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs';

type ProductDetailBreadcrumbsProps = {
  categoryLabel?: ReactNode;
  categoryName?: ReactNode;
  productTitle?: ReactNode;
  productUuid?: string;
}

export default function ProductDetailBreadcrumbs({
  categoryLabel,
  categoryName,
  productTitle,
  productUuid,
}: ProductDetailBreadcrumbsProps) {
  return (
    <div className="
    px-4 mx-auto max-w-[1060px]
    xl:max-w-[1416px] xl:pl-8"
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

          categoryLabel && (
            <NavLink
              className={({ isActive }) => (
                isActive
                  ? "font-medium text-base cursor-pointer capitalize hover:underline"
                  : "text-sm font-bold no-underline text-raisin-black"
              )}
              to={`/${categoryName}`}
              key='2'
            > {categoryLabel} </NavLink>
          ),

          productTitle && (
            <NavLink
              className={({ isActive }) => (
                isActive
                  ? "font-medium text-base no-underline cursor-default pointer-events-none capitalize hover:underline"
                  : "text-sm font-bold no-underline text-raisin-black"
              )}
              to={composeProductDetailURL({
                productName: productTitle as string,
                variationUUID: productUuid as string,
              })}
              key='2'
            > {productTitle}
            </NavLink>
          )
        ]}
      />
    </div>
  )
}