import { useEffect, useState, useRef, useCallback } from 'react';
import { VscChevronLeft, VscChevronRight, VscArrowRight } from 'react-icons/vsc';
import {
  type LinksFunction,
  useFetcher,
  Link,
} from 'react-router';

import { composeProductDetailURL } from '~/utils';
import type { Product } from '~/shared/types';
import { RegularCardWithActionButton } from '~/components/ProductCard';
import { Button } from '~/components/ui/button';

import styles from './styles/HorizontalProductsLayout.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type ActionType = {
  recProds: Product[];
}

const loadingGrids = new Array(12).fill({});

interface HorizontalProductsLayoutProps {
  catName?: string;
  title?: string;
  seeAllLinkTo: string;
}

export default function HorizontalProductsLayout({ catName = 'new_trend', title, seeAllLinkTo }: HorizontalProductsLayoutProps) {
  const fetcher = useFetcher();
  const clickRecProd = useFetcher();
  const [recProds, setRecProds] = useState<Product[]>(loadingGrids);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((toRight: boolean) => {
    if (!window || !containerRef.current || !containerRef.current) return;
    const offset = containerRef.current.clientWidth - 100;

    containerRef!.current.scrollLeft += (toRight ? offset : -offset);
  }, [containerRef]);

  useEffect(() => {
    fetcher.submit(
      { cat_name: catName },
      { action: 'cart/components/horizontal-products' }
    );
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as ActionType;
      setRecProds(data.recProds);
    }
  }, [fetcher.state, fetcher.data]);


  const handleClickGrid = (title: string, prodUUID: string) => {
    console.log('[ga] click on product', title, prodUUID);

    clickRecProd.submit(
      {
        __action: 'to_product_detail',
        productName: title,
        productUUID: prodUUID,
      },
      { method: 'post', action: composeProductDetailURL({ productName: title, productUUID: prodUUID }) },
    );
  }

  return (
    <>
      <div className="w-full p-2.5 max-w-screen-xl mx-auto relative">
        <h3 className="
          font-poppins font-semibold
          text-2xl md:text-3xl
          mt-6 md:mt-8
          mb-2 md:mb-3
          flex
          items-center
        ">
          <span className='capitalize'>{title}</span>
          <div className="
            block w-[1px] h-[25px] bg-[#757575]
            ml-2 md:ml-5
          " />
          <Link to={seeAllLinkTo}>
            <Button
              variant='ghost'
              size='lg'
              className='p-2 md:p-4 inline-flex items-center gap-2 text-primary hover:text-primary/80'
            >
              See all
              <VscArrowRight />
            </Button>
          </Link>
        </h3>

        <div className='absolute top-[38px] md:top-11 right-2 flex gap-2'>
          <button
            type="button"
            aria-label='Page Left'
            className="rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
            onClick={() => scroll(false)}
          >
            <VscChevronLeft />
          </button>
          <button
            type="button"
            aria-label='Page Right'
            className="rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
            onClick={() => scroll(true)}
          >
            <VscChevronRight />
          </button>
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-scroll pt-5 pb-10 hide-scroll-bar"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          <div className="flex flex-nowrap">
            {
              recProds?.map((prod: Product, index: number) => {
                return (
                  <div className="inline-block px-3 min-w-[250px]" key={`${prod.productUUID}_${index}`}>
                    <RegularCardWithActionButton
                      key={`horzontal-prod-${index}`}
                      product={prod}
                      onClickProduct={handleClickGrid}
                      displayActionButton={false}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}
