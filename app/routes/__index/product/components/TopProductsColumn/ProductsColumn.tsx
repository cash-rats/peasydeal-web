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
    <div className="TopProductsColumn__banner-wrapper">
      <h2 className="TopProductsColumn__banner-wrapper-title">
        {columnTitle}
        <span className="TopProductsColumn__banner-wrapper-border" />
      </h2>

      <div className="TopProductsColumn-grid-wrapper">
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
