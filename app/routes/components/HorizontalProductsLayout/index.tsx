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

import styles from './styles/HorizontalProductsLayout.css';
import Grid from './HorizontalGrid';

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
  const [recProds, setRecProds] = useState<Product[]>(loadingGrids);
  const gestureZone = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    fetcher.submit(
      { catID: catID.toString() },
      { method: 'post', action: '/components/HorizontalProductsLayout?index' }
    );

    const handleTouch = () => {
      console.log('[gesture] prevent swipping from triggering onClick event ');
    }

    const gestureZoneDom = gestureZone.current;
    if (!gestureZoneDom) return;
    gestureZoneDom.addEventListener('touchstart', handleTouch, false);
    gestureZoneDom.addEventListener('touchend', handleTouch, false);

    return () => {
      gestureZoneDom.removeEventListener('touchstart', handleTouch);
      gestureZoneDom.removeEventListener('touchend', handleTouch);
    }
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
  }

  const handleClickGrid = (evt: MouseEvent<HTMLDivElement>, prodUUID: string) => {
    console.log('[ga] click on product', prodUUID);
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