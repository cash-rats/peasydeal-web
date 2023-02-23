import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import ImageSuperDealDiscount from './ImageSuperDealDiscount';
import ImageGrandOpeningDiscount from './ImageGrandOpeningDiscount';
import ImageCategoryExtraDiscount from './ImageCategoryExtraDiscount';

import styles from './styles/AllTimeCoupon.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

const AllTimeCoupon = () => {
  return (
    <div className="flex py-4 bg-slate-50 justify-around w-full">
      <div className="hidden md:flex flex-1 justify-center items-center gap-1 md:gap-8">
        <Link to="/super_deal">
          <div className="
            flex flex-col
            hover:scale-x-95
            transition-transform duration-300 ease-in-out
            cursor-pointer
          ">
            <ImageSuperDealDiscount name={'Super Deal Discount'} />
          </div>
        </Link>

        <div className="flex flex-col">
          <ImageGrandOpeningDiscount name={'Grand Opening Discount'} />
        </div>
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center">
        <div className="flex flex-col">
          <ImageCategoryExtraDiscount name={'Category Extra Discount'} />
        </div>
      </div>

      <div className='md:hidden grid grid-cols-2 gap-1 mt-[2px]'>
        <Link
          to="/super_deal"
          className='hover:scale-x-95
            transition-transform duration-300 ease-in-out
            cursor-pointer
          '>
          <ImageSuperDealDiscount name={'Super Deal Discount'} />
        </Link>
        <ImageGrandOpeningDiscount name={'Grand Opening Discount'} />
      </div>
      <div className='md:hidden flex justify-center ml-1'>
        <ImageCategoryExtraDiscount name={'Category Extra Discount'} />
      </div>
    </div>
  );
}

export default AllTimeCoupon;