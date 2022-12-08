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

type ActivityGridProps = {
  mainPic: string;
}

type ActivityBannerLayoutProps = {
  title: string;
  activityProds?: ActivityGridProps[];
  bannerURL?: string;
}

/*
* - Full width carousel
*/
const ActivityBannerLayout = ({
  title,
  activityProds = [],
}: ActivityBannerLayoutProps) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
  };

  return (
    <div className="ActivityBannerLayout__wrapper">
      <div className="ActivityBannerLayout__up">
        <span className="ActivityBannerLayout__title-text"> {title} </span>
      </div>

      <div className="ActivityBannerLayout__slides">
        <Slider {...settings}>
          {
            activityProds.map((prod, idx) => {
              return (
                <div key={idx}>
                  <div className="ActivityBanner__image-container" >
                    <img
                      alt="some alt"
                      className="ActivityBanner__image"
                      src={prod.mainPic}
                    />
                  </div>
                </div>
              )
            })
          }
        </Slider>
      </div>
    </div>
  )
}

export default ActivityBannerLayout