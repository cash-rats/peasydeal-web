import type { LinksFunction } from '@remix-run/node';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiFacebook } from 'react-icons/si';

import type { Category } from '~/shared/types';

import FooterTopInfo from './components/FooterTopInfo';
import FooterMobileLayout, { links as FooterMobileAccordionLinks } from './components/FooterMobileLayout';
import FooterTabletPortrait from './components/FooterTabletPortrait';
import FooterTabletLayout from './components/FooterTabletLayout';

export const links: LinksFunction = () => {
  return [
    ...FooterMobileAccordionLinks(),
  ];
};


interface FooterProps {
  categories?: Category[];
}

function Footer({ categories }: FooterProps) {
  return (
    <>
      <FooterTopInfo />

      <footer className="
        pb-6 pt-10
        px-2 md:px-6 lg:px-14
        bg-dune
        w-full">
        <div className="block lg:hidden w-full p-2.5 max-w-screen-xl mx-auto">
          <FooterMobileLayout categories={categories} />
        </div>

        {/* width > 768px */}
        {/* <div className="sm:hidden md:flex 1024:hidden w-full py-2.5 max-w-screen-xl mx-auto">
          <FooterTabletPortrait categories={categories} />
        </div> */}

        <div className="hidden lg:block w-full py-2.5">
          <FooterTabletLayout categories={categories} />
        </div>

        {/* footer bottom content */}
        <div className="
          h-[105px] mt-10 w-full
          flex flex-col justify-between
          600:flex-row 600:mt-0
        ">
          <div className="
            flex-1 flex flex-row items-center
            font-normal text-sm gap-4
            600:justify-start
          ">
            <span className="text-white capitalize">
              terms of service
            </span>

            <span className="text-white capitalize">
              privacy policy
            </span>

            <span className="text-white capitalize">
              © PeasyDeal 2023 PTE. Ltd.
            </span>
          </div>

          <div className="
            flex-1 flex flex-row items-center justify-center gap-6
            600:justify-end
          ">
            <span className="text-white text-base font-normal">
              Follow us
            </span>
            <a
              className="mr-4"
              rel="noreferrer"
              target="_blank"
              href="https://www.instagram.com/"
            >
              <AiFillInstagram
                color='#fff'
                fontSize={22}
              />
            </a>

            <a
              className="mr-4"
              rel="noreferrer"
              target="_blank"
              href="https://www.twitter.com/"
            >
              <AiOutlineTwitter
                color='#fff'
                fontSize={22}
              />
            </a>

            <a
              rel="noreferrer"
              target="_blank"
              href="https://facebook.com"
            >
              <SiFacebook
                color='#fff'
                fontSize={22}
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;