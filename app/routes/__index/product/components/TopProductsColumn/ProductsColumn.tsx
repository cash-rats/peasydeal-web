import type { Product } from '~/shared/types';

import TopProductsColumnGrid from './TopProductsColumnGrid';

interface TopProductsProps {
  columnTitle?: string;
  products?: Product[];
  loading?: boolean;
}

const loadingItems = new Array(4).fill(0)

export default function ProductsColumn({ columnTitle = '', products = [], loading = false }: TopProductsProps) {
  return (
    <div className="mt-6">
      {/* <h2 className="TopProductsColumn__banner-wrapper-title"> */}
      <h2 className="uppercase text-[1.375rem] font-normal py-4 pt-2 pb-0 m-0 border-b-[1px] border-[black] ">
        {columnTitle}
      </h2>

      <div className="flex flex-col mt-4 gap-5">
        <>
          {
            loading
              ? (
                loadingItems.map((_, index) => <TopProductsColumnGrid key={index} loading />)
              )
              : (
                products.map((prod, index) => {
                  return (
                    <TopProductsColumnGrid
                      productUUID={prod.productUUID}
                      key={index}
                      title={prod.title}
                      image={prod.main_pic}
                    />
                  )
                })
              )
          }
        </>
      </div>
    </div>
  )
}
