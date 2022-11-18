import type { LinksFunction } from '@remix-run/node';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

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

export default function HorizontalProductsLayout() {
  const settings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
  }

  return (
    <div className="HorizontalProductsLayout__wrapper">
      <Slider {...settings}>
        <Grid />
        <Grid />
        <Grid />
        <Grid />

        <Grid />
        <Grid />
        <Grid />
        <Grid />
      </Slider>
    </div>
  );
}