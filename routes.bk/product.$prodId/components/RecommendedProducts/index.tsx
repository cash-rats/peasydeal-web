import { useEffect, useState, forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import type { LinksFunction } from 'react-router';
import { useFetcher, useNavigation } from 'react-router';

// Note: we don't need to import "style links" for this component
// because route `__index/index` already loaded it. If we load it
// again react would echo a error saying duplicate css being loaded
import type { Product } from '~/shared/types';
import ProductRowsLayout, { links as ProductRowsLayoutLinks } from '~/components/ProductRowsLayout';
import { modToXItems } from '~/utils/products';
import { ProductPromotionRow } from '~/components/ProductPromotionRow';

import bg from './images/product-sale-section.jpeg';

const RECOMMENDED_PRODUCTS_ENDPOINT = '/product/components/recommended-products';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsLayoutLinks(),
  ];
};

interface RecommendedProductsProps {
  category: string;
  onClickProduct: (title: string, productID: string) => void;
}

type RecommendedProductsFetcherData = {
  products: Product[];
};

function RecommendedProducts({
  category,
  onClickProduct,
}: RecommendedProductsProps, ref: ForwardedRef<HTMLDivElement>) {
  const fetcher = useFetcher();
  const [rows, setRows] = useState<Product[][]>([]);
  const navigation = useNavigation();

  /**
   * We need to reload recommended product when user changes product. For example:
   *
   *   `/product/LED-Light-Up-Trainers-i.7705390678254` ---> `/product/USB-Rechargeable-Menstrual-Heating-Waist-Belt-i.7773266346210`
   *
   * We'll determine whether user is transitioning between different product i.e. `/product/{product_name}` by checking.
   *    1. Are we being transitioned?
   *    2. Does the next route we are transitioning includes `/product/` in the url?
   */
  useEffect(() => {
    if (
      navigation.state !== 'idle' &&
      navigation.location.pathname.includes('/product/')
    ) {
      fetcher.submit({
        category
      }, { method: 'post', action: RECOMMENDED_PRODUCTS_ENDPOINT });
    }
  }, [navigation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetcher.submit({
      category
    }, { method: 'post', action: RECOMMENDED_PRODUCTS_ENDPOINT });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const { products } = fetcher.data as RecommendedProductsFetcherData;

      // Transform before using it.
      if (products.length > 0) {
        const rows = modToXItems(products);
        setRows(rows);
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div ref={ref}>
      <div
        className={`
          flex
          flex-col
          w-full
          my-6
          py-2.5 md:py-[46px]
          px-2.5 md:px-[26px]
        `}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className='w-full max-w-screen-xl mx-auto'>
          <div className='flex flex-col'>
            <h3 className="
              font-poppins font-bold
              text-2xl md:text-3xl
              mt-6 md:mt-8
              mb-2 md:mb-3
            ">
              Top Selling Products
            </h3>
            <h4 className="
              font-poppins font-normal
              text-lg md:text-xl
              mb-4 md:mb-6
            ">
              Get The Most Popular Items Today
            </h4>
            <ProductPromotionRow
              onClickProduct={onClickProduct}
              products={rows[0]}
            />
          </div>
        </div>
      </div>

      <div className='w-full p-2.5 max-w-screen-xl mx-auto'>
        <div className="flex justify-center xl:justify-start">
          <div className="mt-6 md:mt-8 lg:mt-16 w-full">
            <h3 className='
              font-poppins font-bold
              text-2xl md:text-3xl
              mb-4 md:mb-6
            '>
              You may also like
            </h3>
            {
              <ProductRowsLayout
                loading={fetcher.state !== 'idle'}
                onClickProduct={onClickProduct}
                products={rows[1]}
                defaultSkeloton={8}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef<HTMLDivElement, RecommendedProductsProps>(RecommendedProducts);
