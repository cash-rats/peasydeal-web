import { Link } from '@remix-run/react';
import type { TPromotionType } from '~/shared/types';

import ImageBannerTopSales from './ImageBannerTopSales';
import ImageBannerDealUnder15 from './ImageBannerDealUnder15';
import ImageBannerLatestNewDeal from './ImageBannerLatestNewDeal';
import ImageBannerLaunchSales from './ImageBannerLaunchSales';

interface IPromoActivities {
  promotions: TPromotionType[];
};

const getImageBanner = (name: string) => {
  switch (name) {
    case 'top_sales':
      return <ImageBannerTopSales name={name} />;
    case 'deal_under_15':
      return <ImageBannerDealUnder15 name={name} />;
    case 'latest_new_deal':
      return <ImageBannerLatestNewDeal name={name} />;
    case 'launch_sales':
      return <ImageBannerLaunchSales name={name} />;
  }
}

export default function PromoActivities({ promotions = [] }: IPromoActivities) {
  return (
    <div className='
      grid
      gap-2 md:gap-3 lg:gap-4
      grid-cols-2 md:grid-cols-4
    '>
      {
        promotions.map((promotion: TPromotionType, index: number) => {
          const {
            name,
          } = promotion;

          return (
            <div
              className='
                flex-auto rounded-lg overflow-hidden
                shadow-[2px_4px_16px_rgb(0,0,0,0%)]
                hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
                transition-shadow duration-300 ease-in-out
              '
              key={`${index}_promotion_activities`}
            >
              <Link to={`/${name}`}>
                { getImageBanner(name) }
              </Link>
            </div>
          )
        })
      }
    </div>
  );
}