import type { LinksFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiFacebook } from 'react-icons/si';

import type { Category } from '~/shared/types';

import FooterTopInfo from './components/FooterTopInfo';
import FooterMobileLayout, { links as FooterMobileAccordionLinks } from './components/FooterMobileLayout';
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
        w-full
      ">
        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          <FooterTabletLayout categories={categories} />
        </div>

        {/* footer bottom content */}
        {/* <div className="
          h-[105px] mt-10 w-full
          flex flex-col justify-between
          max-w-screen-xl
          mx-auto
          border-b-[1px] pb-4 border-b-[#2E4E73]
          600:flex-row 600:mt-0
        ">
          <div className="flex flex-row flex-wrap gap-[15px] mt-[10px]">
            {
              categories && categories.map((category, idx) => (
                <Link
                  key={idx}
                  to={
                    category.type === 'promotion'
                      ? `/promotion/${category.name}`
                      : `/collection/${category.name}`
                  }
                >
                  <span
                    className="text-base text-white font-normal capitalize"
                  >
                    {category.title}
                  </span>
                </Link>
              ))
            }
          </div>
        </div> */}
        <div className="
          text-center text-white px-4 py-8 flex flex-col gap-4 max-w-screen-xl mx-auto
          border-b-[1px] border-b-[#2E4E73]
        ">
          <span>PeasyDeal.com is a trading name of <b>PeasyDeal Limited</b>, a company registered in England and Wales.</span>
          <span>© PeasyDeal Limited. 2023</span>
        </div>

        <div className="
          px-4 py-8
          flex-1 flex flex-row items-center justify-center gap-6
        ">
          <a
            className="mr-4"
            rel="noreferrer"
            target="_blank"
            href="https://www.instagram.com/peasydeal"
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
            href="https://www.twitter.com/peasydeal"
          >
            <AiOutlineTwitter
              color='#fff'
              fontSize={22}
            />
          </a>

          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.facebook.com/people/PeasyDeal/100090539543051/"
          >
            <SiFacebook
              color='#fff'
              fontSize={22}
            />
          </a>
        </div>
      </footer>
    </>
  );
}

export default Footer;