import { Link } from 'react-router';
import type { TPromotionType } from '~/shared/types';
import { trackEvent } from '~/lib/gtm';

import { VscChevronRight } from "react-icons/vsc";

interface IPromoActivities {
  promotions: TPromotionType[];
};


// TODO: these info should be retrieved from backend.
const getPromotionInfo = (name: string) => {
  switch (name) {
    case 'super_deal':
      return {
        title: 'Super Deal',
        description: 'Extra 10% OFF',
      };
    case 'deal_under_15':
      return {
        title: 'All deal under £15',
        description: 'Shop smart',
      };
    case 'new_arrival':
      return {
        title: 'New Arrival',
        description: 'Up to 65%+ OFF',
      };
    case 'launch_sales':
      return {
        title: 'Launch Sale',
        description: 'Up to 65%+ OFF',
      };
    case 'hot_deal':
      return {
        title: 'Hot Deals',
        description: 'Deals with great savings',
      }
    default:
      return {
        title: '',
        description: '',
      };
  }
}

export default function PromoActivities({ promotions = [] }: IPromoActivities) {
  return (
    <div className='
      max-w-screen-xl mx-auto
      p-2
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
            <div key={`${index}_promotion_activities`}>
              <Link
                to={`/promotion/${name}`}
                onClick={() => {
                  trackEvent('pd_click_promotion_activities', {
                    promotion: name,
                  });
                }}
              >
                <div className='
                    cursor-pointer
                    bg-white rounded-lg p-2 md:p-4 h-full
                    transition ease-in-out
                    hover:-translate-y-1 duration-150
                  '>
                  <h3 className='text-[#B02E28] text-lg md:text-xl font-bold font-poppins'>{getPromotionInfo(name).description}</h3>
                  <div className='flex items-center justify-between mt-2'>
                    <span className='text-base md:text-xl font-black font-poppins'>{getPromotionInfo(name).title}</span>
                    <span><VscChevronRight className='text-2xl' /></span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })
      }
    </div>
  );
}
