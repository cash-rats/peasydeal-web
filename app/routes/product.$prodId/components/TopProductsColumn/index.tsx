import type { ActionFunctionArgs } from 'react-router';
import { useFetcher, useNavigation } from 'react-router';
import { data } from 'react-router';
import { useEffect, useState } from 'react';

import { ProductRow } from "~/components/ProductRow";
import { fetchProductsByCategoryV2 } from '~/api';
import type { Product } from '~/shared/types';

import bg from './images/product-sale-section.jpeg';

type ActionType = {
  top_products: Product[];
  super_deal_products: Product[];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const [{ items: topProds }, { items: superDealProds }] = await Promise.all([
    await fetchProductsByCategoryV2({
      category: 22,
      perpage: 5,
      random: true,
    }),
    await fetchProductsByCategoryV2({
      category: 2,
      perpage: 4,
      random: true,
    }),
  ]);

  // Load 5 TOP products 22
  // Load 4 Super deals 2
  // You may also like 3
  return data<ActionType>({
    top_products: topProds,
    super_deal_products: superDealProds,
  });
};


interface AdsProducts extends ActionType {
  banner_product: null | Product;
  prods: any;
}

export default function TopProductsColumn() {
  const [adsProds, setAdsProds] = useState<AdsProducts>({
    prods: [],
    banner_product: null,
    top_products: [],
    super_deal_products: [],
  });


  const fetcher = useFetcher();
  const navigation = useNavigation();

  // We need to reload top products when user changes product. For example:
  //
  // `/product/LED-Light-Up-Trainers-i.7705390678254` ---> `/product/USB-Rechargeable-Menstrual-Heating-Waist-Belt-i.7773266346210`
  //
  // We'll determine whether user is transitioning between different product i.e. `/product/{product_name}` by checking.
  //  1. Are we being transitioned.
  //  2. Is the next route we are transitioning includes `/product/`
  useEffect(() => {
    if (
      navigation.state !== 'idle' &&
      navigation.location.pathname.includes('/product/')
    ) {
      fetcher.submit(
        {},
        {
          method: 'post',
          action: '/product/components/TopProductsColumn?index',
        }
      );

    }
  }, [navigation]);

  useEffect(() => {
    fetcher.submit(
      {},
      {
        method: 'post',
        action: '/product/components/TopProductsColumn?index',
      }
    );
  }, []);

  useEffect(() => {
    if (fetcher.type === 'done') {
      const prods = fetcher.data as ActionType;
      const bannerProduct = prods.top_products[0];

      setAdsProds({
        prods: [...prods.top_products, ...prods.super_deal_products],
        banner_product: bannerProduct,
        top_products: prods.top_products.slice(1),
        super_deal_products: prods.super_deal_products,
      });
    }
  }, [fetcher.type]);

  return (
    <div
      className={`
        flex
        flex-col
        w-full p-2.5
        my-6
        py-[30px] sm:py-[46px]
        px-[18px] px-[26px]
      `}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className='flex flex-col'>
        <h3 className="
          font-poppins font-bold
          text-xl md:text-3xl
          mt-2 md:mt-6
          mb-2 md:mb-3">
          Top Selling Products
        </h3>
        <h4 className="font-poppins font-normal	 text-xl mb-4 md:mb-6">
          Get The Most Popular Items Today
        </h4>
      </div>

      {
        adsProds.prods && <ProductRow
          products={adsProds.prods}
        />
      }


      {/* <BannerProduct
        productUUID={adsProds.banner_product?.productUUID}
        loading={fetcher.type !== 'done'}
        title={adsProds.banner_product?.title}
        image={adsProds.banner_product?.main_pic}
      /> */}

      {/* <ProductsColumn
        columnTitle='top products'
        loading={fetcher.type !== 'done'}
        products={adsProds.top_products}
      />

      <ProductsColumn
        columnTitle='super deal'
        loading={fetcher.type !== 'done'}
        products={adsProds.super_deal_products}
      /> */}
    </div>
  );
}