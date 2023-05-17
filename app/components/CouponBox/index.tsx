import type { ReactNode } from 'react';

interface CouponBoxParams {
  children: ReactNode;
};

function CouponBox({ children }: CouponBoxParams) {
  return (
    <span className='text-[#1D1815] text-[14px] md:text-base lg:text-xl bg-white border-dashed border-2 border-[#ccc] px-4 md:px-8 py-3 md:py-4 rounded-lg my-2'>
      {children}
    </span>
  )
}

export default CouponBox;