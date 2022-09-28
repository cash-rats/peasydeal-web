import type { LinksFunction } from '@remix-run/node';
import FooterMobileAccordion, { links as FooterMobileAccordionLinks } from './components/FooterMobileAccordion';
import FooterTabletLayout, { links as FooterTabletLayoutLinks } from './components/FooterTabletLayout';

import styles from './styles/Footer.css';
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
    { rel: 'stylesheet', href: styles },
  ];
};

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-mobile-accordion-container">
        <FooterMobileAccordion />
      </div>

      <div className="footer-tablet-layout-container">
        <FooterTabletLayout />
      </div>

      <div className="bottom-part">
        {/* List of payment method */}
        <div className="payment-methods">
          <ul>
            <li> <img alt="American Express" src={Amex} /> </li>
            <li> <img alt="Apple Pay" src={ApplePay} /> </li>
            <li> <img alt="Discover" src={Discover} /> </li>
            <li> <img alt="Google Pay" src={GooglePay} /> </li>
            <li> <img alt="Master Card" src={MasterCard} /> </li>
            <li> <img alt="Visa" src={Visa} /></li>
          </ul>
        </div>

        {/* Company sign */}
        <div className="company-sign">
          <span>
            © PeasyDeal 2022
          </span>
        </div>

        {/* Social Media */}
        <div className="social-media-links">
          <a
            rel="noreferrer"
            target="_blank"
            href="https://facebook.com"
          >
            <img alt='facebook' src={FB} />
          </a>

          <a

            rel="noreferrer"
            target="_blank"
            href="https://instagram.com"

          >
            <img alt='instagram' src={IG} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;