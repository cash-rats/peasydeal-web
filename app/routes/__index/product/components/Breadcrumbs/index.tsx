import type { ReactNode } from 'react';
import { NavLink } from '@remix-run/react';

import { composeProductDetailURL } from '~/utils';
import {
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
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
    <div className='
      py-0 px-auto
      flex flex-col
      justify-center items-center
      mx-2 md:mx-4'
    >
      <div className="w-full py-2.5 max-w-screen-xl mx-auto">
        <Breadcrumbs
          breadcrumbs={[
            <BreadcrumbItem key="1">
              <BreadcrumbLink as={NavLink} to='/' className="font-semibold">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>,

            <>
              {
                categoryName
                  ? (

                    <BreadcrumbItem key="2">
                      <BreadcrumbLink as={NavLink} to={`/${categoryName}`} className="font-semibold">
                        {categoryLabel}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )
                  : null
              }
            </>,

            <BreadcrumbItem key="3">
              <BreadcrumbLink
                as={NavLink}
                to={composeProductDetailURL({
                  productName: productTitle as string,
                  variationUUID: productUuid as string,
                })}
                isCurrentPage
                className="font-semibold !text-[#D02E7D]"
              >
                {productTitle}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ]}
        />
      </div>
    </div>
  )
}