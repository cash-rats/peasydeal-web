import type { ReactNode } from 'react';

interface CouponBoxParams {
  children: ReactNode;
};

function CouponBox({ children }: CouponBoxParams) {
  return (
    <span className='text-[#1D1815] text-[14px] md:text-base lg:text-lg bg-white px-2 md:px-4 py-1 md:py-2 ml-2 rounded-lg'>
      {children}
    </span>
  )
}

export default CouponBox;