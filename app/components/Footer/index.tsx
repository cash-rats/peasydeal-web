import type { LinksFunction } from '@remix-run/node';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiFacebook } from 'react-icons/si';
import { FiMail } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

import type { Category } from '~/shared/types';

import FooterMobileAccordion, { links as FooterMobileAccordionLinks } from './components/FooterMobileAccordion';
import FooterTabletLayout from './components/FooterTabletLayout';
import Amex from './images/american-express.svg';
import Visa from './images/visa.svg';
import MasterCard from './images/mastercard.svg';
import Paypal from './images/paypal.svg';
import Klarna from './images/klarna-1.svg';

export const links: LinksFunction = () => {
  return [
    ...FooterMobileAccordionLinks(),
  ];
};

const paymentMethod = [
  {
    src: Visa,
    alt: 'visa'
  },
  {
    src: Amex,
    alt: 'amex'
  },
  {
    src: MasterCard,
    alt: 'master card'
  },
  {
    src: Paypal,
    alt: 'paypal'
  },
  {
    src: Klarna,
    alt: 'klarna'
  },
]

interface FooterProps {
  categories?: Category[];
}

function Footer({ categories }: FooterProps) {
  return (
    <>
      {/* Help and service & Payment methods */}
      <div className="w-full grid grid-cols-2 bg-[#EEEEEE]">
        <div className="
          flex flex-col justify-start items-center p-14
          box-border
          border-t-[1px] border-t-[#BABABA]
          border-r-[1px] border-r-[#BABABA]
        ">
          <h1 className="font-bold text-[24px] mb-10 capitalize">
            Help and service
          </h1>

          <div className="flex flex-cols gap-9">
            <div className="flex items-center gap-2">
              <FiMail fontSize={28} />
              <p className="capitalize text-xl font-normal">
                contact us
              </p>
            </div>

            <div className="flex flex-cols">
              <div className="flex items-center gap-2">
                <MdOutlineLocalShipping color='black' fontSize={28} />
                <p className="capitalize text-xl font-normal">
                  track your order
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="
          flex flex-col justify-start items-center p-14
          border-t-[1px] border-t-[#BABABA]
        ">
          <h1 className="font-bold text-[24px] capitalize">
            Payment methods
          </h1>

          <ul className="list-none flex flex-row mt-8">
            {
              paymentMethod.map((m, idx) => (
                <li
                  className="m-[0.625rem]"
                  key={idx}
                >
                  <img
                    className="w-[38px] h-[24px]"
                    alt={m.alt}
                    src={m.src}
                  />
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      <footer className="pb-6 bg-dune w-full pt-10 px-12 ">
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
        </div>
      </footer>
    </>
  );
}

export default Footer;