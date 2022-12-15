import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import BGBottom from './images/BG_bottom.png';
import BGTop from './images/BG_top.png';
import MountainSprite from "./images/mountain_sprite.png";
import styles from './404.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function NotFound() {
  return (
    <div className="relative h-[40rem]">
      <div className="flex mt-10 flex-col">
        {/* title */}
        <div
          className="overflow-hidden h-[193px] bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BGTop})` }}
        />

        {/* indication */}
        <div className="text-sm text-[#343434] font-[500] leading-normal text-center z-100 ">
          {/* power line */}
          <div className="text-2xl mt-3 mb-2 text-[#343434] leading-3">
            Sorry, the page you're looking for cannot be accessed
          </div>

          <div className="mt-5 text-[#343434]">
            Either check the URL or go to
            <span className="text-xl text-[#f0b021]">
              <Link to='/'> Home Page </Link>
            </span>
          </div>
        </div>
      </div>

      <div className="PageNotFound__mountain" style={{ backgroundImage: `url(${MountainSprite})` }} />

      <div
        className="absolute w-[100%] h-[200px] bottom-0 left-0 translate-y-[-85%] overflow-hidden  bg-bbefef bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BGBottom})` }}
      />
    </div>
  );
}