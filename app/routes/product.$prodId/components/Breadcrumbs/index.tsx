import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';

import { composeProductDetailURL } from '~/utils';
import Breadcrumbs, { links as BreadCrumbLink, type BreadcrumbItem } from '~/components/Breadcrumbs/Breadcrumbs';

import type { Category } from '../../types';

type ProductDetailBreadcrumbsProps = {
  categories: Category[];

  productTitle?: ReactNode;
  productUuid?: string;
}

export const links: LinksFunction = () => {
	return [
		...BreadCrumbLink(),
	];
};

export default function ProductDetailBreadcrumbs({
  categories,
  productTitle,
  productUuid,
}: ProductDetailBreadcrumbsProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: 'breadcrumb_home',
      label: 'Home',
      href: '/',
    },
    ...categories.map((category, idx) => ({
      id: `breadcrumb_category_${idx}`,
      label: category.label,
      href: `/collection/${category.name}`,
    })),
    {
      id: 'breadcrumb_product',
      label: productTitle ?? '',
      href: productTitle && productUuid
        ? composeProductDetailURL({
          productName: productTitle as string,
          productUUID: productUuid as string,
        })
        : undefined,
      isCurrent: true,
      className: '!text-[#D02E7D]',
    },
  ];

  return (
    <div className='
      py-0 px-auto
      flex flex-col
      justify-center items-center
      mx-2 md:mx-4'
    >
      <div className="w-full py-2.5 max-w-screen-xl mx-auto">
        <Breadcrumbs
          items={breadcrumbItems}
        />
      </div>
    </div>
  )
}
