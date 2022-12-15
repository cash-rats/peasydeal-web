import type { LinksFunction } from '@remix-run/node';

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
        <div className="text-sm text-[#406455] font-[500] leading-normal text-center z-100 ">
          {/* power line */}
          <div className="text-2xl mb-2 text-[#007e62] leading-3">
            Oops, how'd you get here?!
          </div>

          <div> Something went wrong,</div>

          <div>return to&nbsp;
            <span>
              Home Page
            </span>
          </div>
        </div>
      </div>

      <div className="PageNotFound__mountain" style={{ backgroundImage: `url(${MountainSprite})` }} />

      <div
        className="absolute w-[100%] h-[200px] bottom-0 left-0 translate-y-[-50%] overflow-hidden  bg-bbefef bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BGBottom})` }}
      />
    </div>
  );
}