import type { LinksFunction } from '@remix-run/node';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiFacebook } from 'react-icons/si';

import type { Category } from '~/shared/types';

import FooterMobileAccordion, { links as FooterMobileAccordionLinks } from './components/FooterMobileAccordion';
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
    <footer className="pb-6 bg-dune w-full pt-10 px-12">
      <div className="block md:hidden">
        <FooterMobileAccordion />
      </div>

      <div className="hidden md:block">
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

        {/* List of payment method */}
        {/* <div className="w-full box-border flex justify-center md:flex-1">
          <ul className="p-0 m-0 list-none flex flex-wrap">
            {
              paymentMethods.map((method, index) => (
                <li className="w-9 h-6 m-[0.625rem]" key={index}>
                  <img alt={method.name} src={method.src} />
                </li>
              ))
            }
          </ul>
        </div> */}

        {/* Company sign */}
        {/* <div className="text-center w-full mt-[0.675rem] my-0 mb-6 text-[14px] md:m-0 md:flex-1">
          <span className="text-white">
            © PeasyDeal 2022
          </span>
        </div> */}

        {/* Social Media */}
        {/* <div className="flex justify-center items-center gap-4 lg:flex-1">
          <a
            rel="noreferrer"
            target="_blank"
            href="https://facebook.com"
          >
            <img className="w-4 h-4" alt='facebook' src={FB} />
          </a>

          <a
            rel="noreferrer"
            target="_blank"
            href="https://instagram.com"
          >
            <img className="w-4 h-4" alt='instagram' src={IG} />
          </a>
        </div> */}
      </div>
    </footer>
  );
}

export default Footer;