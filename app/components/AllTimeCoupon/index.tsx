import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/allTimeCoupon.css';

export const links: LinksFunction = () => {
  return [
    // Google meta tags
    { rel: 'stylesheet', href: styles },
  ];
}

const AllTimeCoupon = ({ isFullLayout = false}: { isFullLayout?: boolean }) => {
  return (
    <>
      <Link
        to="/collection/electronics"
        onClick={() => {
          window.rudderanalytics?.track('click_all_time_coupon', {
            coupon: 'ELEC15',
          });
        }}
      >
        {
          isFullLayout ? (
            <div className='bg-[#1D1815] text-white font-medium flex items-center p-2.5 md:p-3 shadow-lg justify-center'>
              <p className='text-base md:text-base lg:text-lg'>EXTRA <b className='font-bold text-[#FF93E7]'>15% OFF</b> on ELECTRONIC for £19.99+</p>
              <span className='text-[#1D1815] bg-white px-2 md:px-4 py-1 md:py-2 ml-2 rounded-lg'>
                CODE: <b className='font-poppins'>ELEC15</b>
              </span>
            </div>
          ) : (
            <div className='bg-[#1D1815] rounded-lg text-white font-medium flex items-center p-3 shadow-lg justify-between'>
              <p className='text-[14px] md:text-base lg:text-lg'>EXTRA <b className='font-bold text-[#FF93E7]'>15% OFF</b> on ELECTRONIC for £19.99+</p>
              <span className='text-[#1D1815] text-[14px] md:text-base lg:text-lg bg-white px-2 md:px-4 py-1 md:py-2 ml-2 rounded-lg'>
                CODE: <b className='font-poppins'>ELEC15</b>
              </span>
            </div>
          )
        }
      </Link>
    </>
  );
}

export default AllTimeCoupon;