import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import type { LinksFunction } from '@remix-run/node';

import { composeProductDetailURL } from '~/utils';
import {
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import Breadcrumbs, { links as BreadCrumbLink } from '~/components/Breadcrumbs/Breadcrumbs';

import type { Category } from '../../types';

type ProductDetailBreadcrumbsProps = {
  // categoryLabel?: ReactNode;
  // categoryName?: ReactNode;
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


  return (
    <div className='
      py-0 px-auto
      flex flex-col
      justify-center items-center
      mx-2 md:mx-4'
    >
      <div className="w-full py-2.5 max-w-screen-xl mx-auto">
        <Breadcrumbs
          breadcrumbs={
            [
              <BreadcrumbItem key="breadcrumb_home">
                <BreadcrumbLink as={NavLink} to='/' className="font-semibold">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>,

              ...categories.map((category, idx) => (
                (
                  <BreadcrumbItem key={`breadcrumb_body_${idx}`}>
                    <BreadcrumbLink
                      as={NavLink}
                      to={`/collection/${category.name}`}
                      className="font-semibold"
                    >
                      {category.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )
              )),

              <BreadcrumbItem key="breadcrumb_prod">
                <BreadcrumbLink
                  as={NavLink}
                  to={composeProductDetailURL({
                    productName: productTitle as string,
                    productUUID: productUuid as string,
                  })}
                  isCurrentPage
                  className="font-semibold !text-[#D02E7D]"
                >
                  {productTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ]
          }
        />
      </div>
    </div>
  )
}