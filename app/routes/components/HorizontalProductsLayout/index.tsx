import { useEffect, useState, useRef, useCallback } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, Link } from '@remix-run/react';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

import { IconButton, Button } from '@chakra-ui/react';
import { VscChevronLeft, VscChevronRight, VscArrowRight } from 'react-icons/vsc';

import { composeProductDetailURL } from '~/utils';
import type { Product } from '~/shared/types';
import { fetchProductsByCategoryV2 } from '~/api';
import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";
import { breakPoints } from '~/styles/breakpoints';
import { RegularCardWithActionButton, links as ProductCardLinks } from '~/components/ProductCard';

import styles from './styles/HorizontalProductsLayout.css';

export const links: LinksFunction = () => {
  return [
    ...ProductCardLinks(),
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: slickStyles },
    { rel: 'stylesheet', href: slickThemeStyles },
  ];
};

type ActionType = {
  recProds: Product[];
}

const loadingGrids = new Array(12).fill({});

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());
  const catID = formEntries['catID'] || '2';

  // Fetch top seller & new trend.
  const { items: recProds } = await fetchProductsByCategoryV2({
    category: Number(catID),
    perpage: 12,
    random: true,
  });

  return json<ActionType>({ recProds: recProds });
}

interface HorizontalProductsLayoutProps {
  catID?: number;
  title?: string;
  seeAllLinkTo: string;
}

export default function HorizontalProductsLayout({ catID = 2, title, seeAllLinkTo }: HorizontalProductsLayoutProps) {
  const fetcher = useFetcher();
  const clickRecProd = useFetcher();

  const [recProds, setRecProds] = useState<Product[]>(loadingGrids);
  const gestureZone = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<Slider | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((toRight: boolean) => {
    if (!window || !containerRef.current || !containerRef.current) return;
    const offset = containerRef.current.clientWidth - 100;

    containerRef!.current.scrollLeft += (toRight ? offset : -offset);
  }, [containerRef]);

  useEffect(() => {
    fetcher.submit(
      { catID: catID.toString() },
      { method: 'post', action: '/components/HorizontalProductsLayout?index' }
    );
  }, []);

  useEffect(() => {
    if (fetcher.type === 'done') {
      const data = fetcher.data as ActionType;
      setRecProds(data.recProds);
    }
  }, [fetcher.type]);

  const settings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    responsive: [
      {
        breakpoint: breakPoints.screen1024min,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: breakPoints.screen768min,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: breakPoints.screen600min,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
  }

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
          <span>{title} </span>
          <div className="
            block w-[1px] h-[25px] bg-[#757575]
            ml-2 md:ml-5
          " />
          <Link to={seeAllLinkTo}>
            <Button
              rightIcon={<VscArrowRight />}
              colorScheme='teal'
              variant='ghost'
              size='lg'
              className='p-2 md:p-4'
            >
              See all
            </Button>
          </Link>
        </h3>

        <div className='absolute top-[38px] md:top-11 right-2'>
          <IconButton
            aria-label='Page Left'
            icon={<VscChevronLeft />}
            onClick={() => scroll(false)}
            className='mr-2 bg-white'
          />
          <IconButton
            aria-label='Page Right'
            icon={<VscChevronRight />}
            onClick={() => scroll(true)}
            className='bg-white'
          />
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-scroll pt-5 pb-10 hide-scroll-bar smooth-scrolling"
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
                      />
                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>
      {/* <div className="HorizontalGrid__rec-products">
        <h1 className="HorizontalGrid__rec-title">

          <div className="HorizontalGrid__rec-title-left">
            <span>{title} </span>
            <Link to={seeAllLinkTo}>
              <span className="HorizontalGrid__rec-see-all"> see all </span>
            </Link>
          </div>

          <div className="HorizontalGrid__rec-title-right">
          </div>
        </h1>
        <div ref={gestureZone} className="HorizontalProductsLayout__wrapper">
          <Slider ref={sliderRef} {...settings}>
            {
              recProds.map((prod, index) => {
                return (
                  <RegularCardWithActionButton
                    key={`horzontal-prod-${index}`}
                    product={prod}
                    onClickProduct={handleClickGrid}

                  />
                )
              })
            }
          </Slider>
        </div>
      </div> */}
    </>
  );
}