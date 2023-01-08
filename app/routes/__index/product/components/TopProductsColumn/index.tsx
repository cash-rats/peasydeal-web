import type { ActionFunction } from '@remix-run/node';
import { useFetcher, useTransition } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useEffect, useState } from 'react';

import { fetchProductsByCategory, fetchProductsByCategoryV2 } from '~/api';
import type { Product } from '~/shared/types';

import BannerProduct from './BannerProduct';
import ProductsColumn from './ProductsColumn';

type ActionType = {
  top_products: Product[];
  super_deal_products: Product[];
};

export const action: ActionFunction = async ({ request }) => {
  const [topProds, superDealProds] = await Promise.all([
    await fetchProductsByCategoryV2({
      category: 22,
      perpage: 5,
      random: true,
    }),
    await fetchProductsByCategory({
      category: 2,
      perpage: 4,
      random: 1,
    }),
  ]);

  // Load 5 TOP products 22
  // Load 4 Super deals 2
  // You may also like 3
  return json<ActionType>({
    top_products: topProds,
    super_deal_products: superDealProds,
  });
};


interface AdsProducts extends ActionType {
  banner_product: null | Product;
}

export default function TopProductsColumn() {
  const [adsProds, setAdsProds] = useState<AdsProducts>({
    banner_product: null,
    top_products: [],
    super_deal_products: [],
  });


  const fetcher = useFetcher();
  const transition = useTransition();
  useEffect(() => {
    if (transition.state !== 'idle') {
      fetcher.submit(
        {},
        {
          method: 'post',
          action: '/product/components/TopProductsColumn?index',
        }
      );

    }
  }, [transition.state]);

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
        banner_product: bannerProduct,
        top_products: prods.top_products.slice(1),
        super_deal_products: prods.super_deal_products,
      });
    }
  }, [fetcher.type]);

  return (
    <div className="xl:w-[12rem] 1348:w-[15.875rem] flex flex-col">
      <BannerProduct
        productUUID={adsProds.banner_product?.productUUID}
        loading={fetcher.type !== 'done'}
        title={adsProds.banner_product?.title}
        image={adsProds.banner_product?.main_pic}
      />

      <ProductsColumn
        columnTitle='top products'
        loading={fetcher.type !== 'done'}
        products={adsProds.top_products}
      />

      <ProductsColumn
        columnTitle='super deal'
        loading={fetcher.type !== 'done'}
        products={adsProds.super_deal_products}
      />
    </div>
  );
}