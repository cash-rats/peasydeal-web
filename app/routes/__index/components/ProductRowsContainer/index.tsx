import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component';

import { OneMainTwoSubs, EvenRow, ProductRow, ProductRowLinks } from "~/components/ProductRow";
import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import { links as EvenRowLinks } from '~/components/ProductRow/EvenRow';
import type { Product } from '~/shared/types';

import styles from './styles/ProductRowsContainer.css';

export const links: LinksFunction = () => {
  return [
    ...OneMainTwoSubsLinks(),
    ...EvenRowLinks(),
    ...ProductRowLinks(),
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
  productRows?: Product[][];
  // activityBanners?: ActivityBanner[];
  // seasonals?: SeasonalInfo[];
  loading?: boolean;

  // Used to improve performance for react-lazy-load-image-component
  scrollPosition?: ScrollPosition;

  onClickAddToCart?: (prodID: string) => void;

  // Reacts shopnow button in activity banner.
  onClickShopNow?: (catID: number, catTitle: string) => void;
}

function ProductRowsContainer({
  onClickProduct = () => { },
  productRows = [],
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
            productRows.map((row: Product[], index) => {
              return (
                <div
                  className='w-full max-w-screen-xl mx-auto'
                  key={`product-row-${index}`}
                >
                  <ProductRow
                    products={row}
                    scrollPosition={scrollPosition}
                    onClickProduct={onClickProduct}
                  />
                </div>
              );
            })
          )
      }
    </div>
  );
}

export default ProductRowsContainer;
