import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/allTimeCoupon.css';

export const links: LinksFunction = () => {
  return [
    // Google meta tags
    { rel: 'stylesheet', href: styles },
  ];
}

const AllTimeCoupon = () => {
  return (
    <>
      <Link to="/collection/electronics">
        <div className='bg-[#1D1815] rounded-lg text-white font-medium flex items-center p-3 shadow-lg'>
          <p>EXTR <b className='font-bold text-[#FF93E7]'>15% OFF</b> on ELECTRONIC for £19.99+</p>
          <span className='text-[#1D1815] bg-white px-2 md:px-4 py-1 md:py-2 ml-auto rounded-lg'>
            CODE: <b className='font-poppins'>ELEC15</b>
          </span>
        </div>
      </Link>
    </>
  );
}

export default AllTimeCoupon;