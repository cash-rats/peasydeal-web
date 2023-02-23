import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component';

import { OneMainTwoSubs, EvenRow } from "~/components/ProductRow";
import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import { links as EvenRowLinks } from '~/components/ProductRow/EvenRow';
import type { Product } from '~/shared/types';

import { RegularCardWithActionButton, links as ProductCartLinks } from '~/components/ProductCard';

import styles from './styles/ProductRowsContainer.css';

export const links: LinksFunction = () => {
  return [
    ...OneMainTwoSubsLinks(),
    ...EvenRowLinks(),
    ...ProductCartLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

const LoadingRows = () => {
  return (
    <>
      <div className="productRowsContainer__product-row">
        <OneMainTwoSubs loading />
      </div>

      <div className="productRowsContainer__product-row">
        <EvenRow loading />
      </div>
    </>
  );
}

interface ProductRowsContainerProps {
  onClickProduct?: (title: string, prodID: string) => void;

  products?: Product[];

  loading?: boolean;

  // Used to improve performance for react-lazy-load-image-component
  scrollPosition?: ScrollPosition;

  onClickAddToCart?: (prodID: string) => void;

  // Reacts shopnow button in activity banner.
  onClickShopNow?: (catID: number, catTitle: string) => void;
}

function ProductRowsContainer({
  onClickProduct = () => { },
  products = [],
  loading = false,
  scrollPosition,

  onClickAddToCart = () => { },
}: ProductRowsContainerProps) {

  return (
    <div className='w-full'>
      {
        loading
          ? (<LoadingRows />)
          : (
            <div className='w-full max-w-screen-xl mx-auto'>
              <div className="
                    grid
                    gap-2 md:gap-3 lg:gap-4
                    grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                    mb-2 md:mb-3 lg:mb-4
                  ">
                {
                  products.map((product: Product, index) => {
                    return (
                      <RegularCardWithActionButton
                        key={`product-item-${index}-${product.productUUID}`}
                        product={product}
                        scrollPosition={scrollPosition}
                        onClickProduct={onClickProduct}
                      />
                    )
                  })
                }
              </div>
            </div>
          )
      }
    </div>
  );
}

export default ProductRowsContainer;
