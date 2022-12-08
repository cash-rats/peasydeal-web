import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import type { LinksFunction } from '@remix-run/node';

import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";

import styles from './styles/ActivityBannerLayout.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: slickStyles },
    { rel: 'stylesheet', href: slickThemeStyles },
    { rel: 'stylesheet', href: styles },
  ];
};


const Grid = () => {
  return (
    <div>
      grid
    </div>

  );
}

type ActivityGridProps = {
  url: string;
}

type ActivityBannerLayoutProps = {
  activityProds?: ActivityGridProps[];
}

/*
* - Full width carousel
*/
const ActivityBannerLayout = ({ activityProds = [] }: ActivityBannerLayoutProps) => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
  };

  return (
    <div className="ActivityBannerLayout__wrapper">
      <Slider {...settings}>
        {
          activityProds.map((prod, idx) => {
            return (
              <div
                key={idx}
                className="ActivityBanner__image-container"
              >
                <img
                  alt="some alt"
                  className="ActivityBanner__image"
                  src={prod.url}
                />
              </div>
            )
          })
        }
      </Slider>
    </div>
  )
}

export default ActivityBannerLayout