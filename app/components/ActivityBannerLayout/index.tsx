import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import type { LinksFunction } from '@remix-run/node';
import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";
import { Link } from '@remix-run/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import type { ScrollPosition } from 'react-lazy-load-image-component';

import { composeProductDetailURL } from '~/utils';
import { breakPoints } from '~/styles/breakpoints';
import SunShine, { links as SunShineLinks } from '~/components/Tags/SunShine';

import RoundButton from '../RoundButton';
import styles from './styles/ActivityBannerLayout.css';
import ActivityBannerSkeleton from './ActivityItemSkeleton';

export const links: LinksFunction = () => {
  return [
    ...SunShineLinks(),
    { rel: 'stylesheet', href: slickStyles },
    { rel: 'stylesheet', href: slickThemeStyles },
    { rel: 'stylesheet', href: styles },
  ];
};

type ActivityGridProps = {
  mainPic: string;
  title: string;
  productUuid: string;
  discountOff: number;
}

type ActivityInfo = {
  title: string;
  catID: number;
  catTitle: string;
}

type ActivityBannerLayoutProps = {
  activityInfo: ActivityInfo;

  activityProds?: ActivityGridProps[];

  scrollPosition?: ScrollPosition;

  // [WIP] Reacts to add to cart button.
  onClickAddToCart?: () => void;
}

/*
 * - [x] Full width carousel
 * - [x] Responsive view
 * - [x] Add shop now button
 * - [ ] Add price off tag
 * - [x] Finish redirect on click shop now button.
 * - [x] Finish redirect on click view button.
 */
const ActivityBannerLayout = ({
  activityInfo,
  activityProds = [],
  scrollPosition,
}: ActivityBannerLayoutProps) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
    responsive: [
      {
        breakpoint: breakPoints.screen600min,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        },
      }
    ],
  };

  return (
    <div className="ActivityBannerLayout__wrapper">
      <div className="ActivityBannerLayout__up">
        <span className="ActivityBannerLayout__title-text">
          {activityInfo.title}
        </span>
        <div className="ActivityBannerLayout__buy-now">
          <Link to={`/${activityInfo.catTitle}`}>
            <RoundButton colorScheme='blackcontained'>
              <b> shop now! </b>
            </RoundButton>
          </Link>
        </div>
      </div>

      <div className="ActivityBannerLayout__slides">
        <Slider {...settings}>
          {
            activityProds.map((prod, idx) => {
              const nDiscount = ~~(prod.discountOff * 100);
              return (
                <div key={idx} className="ActivityBanner__wrapper">
                  <div
                    className="ActivityBanner__image-container bg-contain bg-center bg-no-repeat bg-white"
                    style={{ backgroundImage: `url('${prod.mainPic}')`}}
                  >
                    <SunShine text={`${nDiscount}% off`} direction='right' />
                    <LazyLoadImage
                      alt={prod.title}
                      className="ActivityBanner__image opacity-0"
                      src={prod.mainPic}
                      placeholder={<ActivityBannerSkeleton />}
                      scrollPosition={scrollPosition}
                    />
                  </div>

                  <div className="ActivityBannerLayout__desc">
                    <p className="ActivityBannerLayout__title">
                      {prod.title}
                    </p>
                    <div className="ActivityBannerLayout__btn">
                      <Link to={composeProductDetailURL({
                        productName: prod.title,
                        variationUUID: prod.productUuid,
                      })}>
                        <RoundButton
                          colorScheme='cerise'
                        >
                          <p> View </p>
                        </RoundButton>
                      </Link>
                    </div>
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