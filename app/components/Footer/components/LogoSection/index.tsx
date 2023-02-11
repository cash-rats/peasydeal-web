import { Link } from '@remix-run/react'

import PeasyDealLOGO from './images/peasydeal_logo_white.svg';

function LogoSection() {
  return (
    <div className="flex flex-col">
      <Link to="/">
        <img
          width={220}
          height={85}
          alt="peasydeal"
          src={PeasyDealLOGO}
        />
      </Link>

      <p className="
          w-full
        text-[#f7f7ee] text-lg capitalize mt-4
          600:pt-4
        ">
        Shop with us for the best deals on the web - unbeatable prices and weekly updates
      </p>
    </div>
  );
}

export default LogoSection;