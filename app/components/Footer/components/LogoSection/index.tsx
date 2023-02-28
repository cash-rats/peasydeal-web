import { Link } from '@remix-run/react'

import PeasyDealLOGO from './images/peasydeal_logo_white.svg';

function LogoSection() {
  return (
    <div className="flex flex-col">
      <Link to="/">
        <img
          className='w-[180px] md:w-[220px]'
          alt="peasydeal"
          src={PeasyDealLOGO}
        />
      </Link>

      <p className="
        w-full mt-4
        text-base md:text-lg
        text-[#f7f7ee]  capitalize
      ">
        Shop with us for the best deals on the web - unbeatable prices and weekly updates
      </p>
    </div>
  );
}

export default LogoSection;