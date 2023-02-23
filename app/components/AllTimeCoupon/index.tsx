import type { LinksFunction } from '@remix-run/node';

import styles from './styles/AllTimeCoupon.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

const AllTimeCoupon = () => {
  return (
    <div className="flex py-4">
      <div className="flex flex-1 justify-center items-center gap-8">
        <div className="flex flex-col min-w-[150px]">
          <span className="flex w-fit self-center justify-center px-3 py-1 items-center rounded-2xl font-medium bg-[#EA4335] text-white">Extra</span>
          <div className="relative flex justify-center">
            <span className="text-[48px] font-poppins font-black">10%</span>
            <span className="absolute right-[0%] top-[33%] font-black rotate-[-90deg]">OFF</span>
          </div>
          <div className="flex flex-col text-center w-full self-center bg-[#D02E7D] font-black text-2xl p-3 rounded text-white">
            <h3>Super Deal</h3>
          </div>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <span className="flex w-fit self-center justify-center px-3 py-1 items-center rounded-2xl font-medium bg-[#EA4335] text-white">Up to</span>
          <div className="relative flex justify-center">
            <span className="text-[48px] font-poppins font-black">65%</span>
            <span className="absolute right-[-4%] top-[33%] font-black rotate-[-90deg]">OFF</span>
          </div>
          <div className="flex flex-col text-center w-full self-center bg-[#D02E7D] font-black text-2xl p-3 rounded text-white">
            <h3>ALL SITE</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center gap-8">
        <div className="flex flex-col min-w-[150px]">
          <span className="flex w-fit self-center justify-center px-3 py-1 items-center rounded-2xl font-medium bg-[#EA4335] text-white">Extra</span>
          <div className="relative flex justify-center">
            <span className="text-[48px] font-poppins font-black">10%</span>
            <span className="absolute right-[0%] top-[33%] font-black rotate-[-90deg]">OFF</span>
          </div>
          <div className="flex flex-col text-center w-full self-center bg-[#D02E7D] font-black text-2xl p-3 rounded text-white">
            <h3>Super Deal</h3>
          </div>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <span className="flex w-fit self-center justify-center px-3 py-1 items-center rounded-2xl font-medium bg-[#EA4335] text-white">Up to</span>
          <div className="relative flex justify-center">
            <span className="text-[48px] font-poppins font-black">65%</span>
            <span className="absolute right-[-4%] top-[33%] font-black rotate-[-90deg]">OFF</span>
          </div>
          <div className="flex flex-col text-center w-full self-center bg-[#D02E7D] font-black text-2xl p-3 rounded text-white">
            <h3>ALL SITE</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllTimeCoupon;