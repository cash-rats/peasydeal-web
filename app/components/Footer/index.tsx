import type { LinksFunction } from '@remix-run/node';
import FooterMobileAccordion, { links as FooterMobileAccordionLinks } from './components/FooterMobileAccordion';
import FooterTabletLayout, { links as FooterTabletLayoutLinks } from './components/FooterTabletLayout';

import Amex from './images/amex.svg';
import ApplePay from './images/apple_pay.svg';
import Discover from './images/pi_discover.svg';
import GooglePay from './images/google_pay.svg';
import MasterCard from './images/pi_master.svg';
import Visa from './images/visa.svg';
import FB from './images/facebook.svg';
import IG from './images/ig.svg';

export const links: LinksFunction = () => {
  return [
    ...FooterTabletLayoutLinks(),
    ...FooterMobileAccordionLinks(),
  ];
};

const paymentMethods = [
  {
    name: 'American Express',
    src: Amex,
  },
  {
    name: 'Apple Pay',
    src: ApplePay,
  },
  {
    name: 'Discover',
    src: Discover,
  },
  {
    name: 'Google Pay',
    src: GooglePay,
  },
  {
    name: 'Master Card',
    src: MasterCard,
  },
  {
    name: 'Visa',
    src: Visa,
  }
];

function Footer() {
  return (
    <footer className="pb-6 bg-white-smoke w-full">
      <div className="block md:hidden">
        <FooterMobileAccordion />
      </div>

      <div className="hidden md:block">
        <FooterTabletLayout />
      </div>

      <div className="py-0 px-4 lg:flex lg:flex-row items-center">
        {/* List of payment method */}
        <div className="w-full box-border flex justify-center md:flex-1">
          <ul className="p-0 m-0 list-none flex flex-wrap">
            {
              paymentMethods.map((method, index) => (
                <li className="w-9 h-6 m-[0.625rem]" key={index}>
                  <img alt={method.name} src={method.src} />
                </li>
              ))
            }
          </ul>
        </div>

        {/* Company sign */}
        <div className="text-center w-full mt-[0.675rem] my-0 mb-6 text-[14px] md:m-0 md:flex-1">
          <span>
            © PeasyDeal 2022
          </span>
        </div>

        {/* Social Media */}
        <div className="flex justify-center items-center gap-4 lg:flex-1">
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
        </div>
      </div>
    </footer>
  );
}

export default Footer;