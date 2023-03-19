import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import ImageSuperDealDiscount from './ImageSuperDealDiscount';
import ImageGrandOpeningDiscount from './ImageGrandOpeningDiscount';
import ImageCategoryExtraDiscount from './ImageCategoryExtraDiscount';

import styles from './styles/allTimeCoupon.css';

export const links: LinksFunction = () => {
  return [
    // Google meta tags
    { rel: 'stylesheet', href: styles },
  ];
}

const AllTimeCoupon = () => {
  return (
    <div className="flex py-4 py bg-slate-50 justify-around w-full">
      <div className="hidden md:flex flex-1 justify-center items-center gap-1 md:gap-8">
        <Link to="/promotion/super_deal">
          <div className="flex flex-col">
            <div className='coupon-link-btn'>
              <ImageSuperDealDiscount name={'Super Deal Discount'} />
            </div>
          </div>
        </Link>

        <div className="flex flex-col">
          <ImageGrandOpeningDiscount name={'Grand Opening Discount'} />
        </div>
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center">
        <div className="flex flex-col">
          <Link to="/electronics">
            <div className='coupon-link-btn'>
              <ImageCategoryExtraDiscount name={'Category Extra Discount'} />
            </div>
          </Link>
        </div>
      </div>

      <div className='md:hidden grid grid-cols-2 gap-1 mt-[2px]'>
        <Link to="/promotion/super_deal">
          <div className='coupon-link-btn'>
            <ImageSuperDealDiscount name={'Super Deal Discount'} />
          </div>
        </Link>
        <ImageGrandOpeningDiscount name={'Grand Opening Discount'} />
      </div>
      <div className='md:hidden flex justify-center ml-1'>
        <Link to="/electronics">
          <div className='coupon-link-btn'>
            <ImageCategoryExtraDiscount name={'Category Extra Discount'} />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AllTimeCoupon;