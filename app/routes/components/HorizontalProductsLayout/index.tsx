import { useEffect, useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

import type { Product } from '~/shared/types';
import { fetchProductsByCategory } from '~/api';
import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";
import { breakPoints } from '~/styles/breakpoints';

import styles from './styles/HorizontalProductsLayout.css';
import Grid from './HorizontalGrid';
import { breakpoints } from '@mui/system';


export const links: LinksFunction = () => {
  return [
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
  const recProds = await fetchProductsByCategory({
    category: Number(catID),
    perpage: 12,
    random: 1,
  });

  return json<ActionType>({
    recProds,
  });
}

interface HorizontalProductsLayoutProps {
  catID?: number;
}

export default function HorizontalProductsLayout({ catID = 2 }: HorizontalProductsLayoutProps) {
  const fetcher = useFetcher();
  const clickRecProd = useFetcher();

  const [recProds, setRecProds] = useState<Product[]>(loadingGrids);
  const gestureZone = useRef<HTMLDivElement | null>(null);

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

  const handleClickGrid = (evt: MouseEvent, prodUUID: string) => {
    console.log('[ga] click on product', prodUUID);

    clickRecProd.submit(
      { __action: 'to_product_detail', productUUID: prodUUID },
      { method: 'post', action: `/product/${prodUUID}` },
    );
  }

  return (
    <div ref={gestureZone} className="HorizontalProductsLayout__wrapper">
      <Slider {...settings}>
        {
          recProds.map((prod, index) => {
            return (
              <Grid
                loading={fetcher.type !== 'done'}
                key={index}
                src={prod.main_pic}
                title={prod.title}
                price={prod.salePrice}
                productUUID={prod.productUUID}
                onClick={handleClickGrid}
              />
            )
          })
        }
      </Slider>
    </div>
  );
}