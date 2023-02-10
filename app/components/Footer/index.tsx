import type { LinksFunction } from '@remix-run/node';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiFacebook } from 'react-icons/si';

import type { Category } from '~/shared/types';

import FooterTopInfo from './components/FooterTopInfo';
import FooterMobileAccordion, { links as FooterMobileAccordionLinks } from './components/FooterMobileAccordion';
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

      <footer className="pb-6 bg-dune w-full pt-10 px-12 ">
        <div className="block md:hidden">
          <FooterMobileAccordion />
        </div>

        {/* width > 768px */}
        <div className="hidden md:block 992:hidden">
          <FooterTabletPortrait />
        </div>

        {/* width > 992px  */}
        <div className="hidden 992:block">
          <FooterTabletLayout categories={categories} />
        </div>

        {/* footer bottom content */}
        <div className="
        h-[105px] mt-10 w-full
        flex flex-row justify-between
      ">
          <div className="
          flex-1 flex flex-row items-center
          font-normal text-sm gap-4
        ">
            <span className="text-white capitalize">
              terms of service
            </span>

            <span className="text-white capitalize">
              privacy policy
            </span>

            <span className="text-white capitalize">
              © PeasyDeal 2022 PTE. Ltd.
            </span>
          </div>

          <div className=" flex-1 flex flex-row items-center justify-end gap-6">
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