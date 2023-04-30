import { Link } from '@remix-run/react';

import fatalError from './images/fatal-error.svg';

export default function NotFound() {
  return (
    <div className="relative py-10">
      <div className="flex mt-10 flex-col">
        <h1 className='font-black font-poppins text-3xl text-center mb-6 capitalized'>
          Page Not Found
        </h1>

        <div
          className="overflow-hidden h-[193px] bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fatalError})` }}
        />

        <div className="text-sm text-[#343434] font-medium leading-normal text-center z-100 ">
          <div className="mt-3 mb-2">
            <h2 className="font-poppins text-xl text-[#343434] leading-2">
              Sorry, the page you're looking for cannot be accessed
            </h2>
          </div>

          <div className="font-poppins mt-2 text-[#343434]">
            Either check the URL or go to
            <span className="font-poppins text-xl text-[#f0b021]">
              <Link to='/'> Home Page </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}