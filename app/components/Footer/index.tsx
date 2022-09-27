import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';
import {
  TextField,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

import styles from './styles/Footer.css';
import Amex from './images/amex.svg';
import ApplePay from './images/apple_pay.svg';
import Discover from './images/pi_discover.svg';
import GooglePay from './images/google_pay.svg';
import MasterCard from './images/pi_master.svg';
import Visa from './images/visa.svg';
import clsx from 'clsx';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type PanelStatus = {
  [index: string]: boolean;
  panel1: boolean;
  panel2: boolean;
  panel3: boolean;
  panel4: boolean;
}

interface FooterListTitleProps {
  onClick: () => void;
  isActive: boolean;
  title: ReactNode | string;
}

// @doc: Accordion animation https://codepen.io/felipefialho/pen/AwYmMe
function FooterListTitle({ onClick, isActive = false, title }: FooterListTitleProps) {
  return (
    <div
      className="footer-list-title"
      onClick={onClick}
    >
      <h3>
        {title}
      </h3>
      <span>
        {
          isActive
            ? <BiChevronUp />
            : <BiChevronDown />
        }

      </span>
    </div>
  );
}

interface FooterListContentProps {
  children: ReactNode;
  isActive: boolean;
}

// TODO: refactor transition mechanism.
function FooterListContent({ children, isActive }: FooterListContentProps) {
  return (
    <div
      className={clsx("footer-list-content", {
        "footer-item-grow": isActive,
      }
      )}
    >
      {children}
    </div>
  );
}

function Footer() {
  const [panelStatus, setPanelStatus] = useState<PanelStatus>({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  return (
    <footer className="footer-container">
      <ul className="footer-list">
        <li
          id="panel1"
          className="footer-list-panel"
        >
          <FooterListTitle
            onClick={() => {
              setPanelStatus({
                ...panelStatus,
                panel1: !panelStatus.panel1,
              });
            }}
            isActive={panelStatus.panel1}
            title="Subscribe"
          />
          <FooterListContent isActive={panelStatus['panel1']}>
            <p className="desc">
              Enter your email below to be the first to know about new collections and product launches.
            </p>

            <div>
              <TextField
                fullWidth
                placeholder='Enter your email'
                variant='outlined'
                size='small'
                InputProps={{
                  startAdornment: (
                    <span style={{ paddingRight: '4px' }}>
                      <EmailIcon
                        color='primary'
                        fontSize='small'
                      />
                    </span>
                  )
                }}
              />
            </div>
          </FooterListContent>
        </li>

        <li>
          <FooterListTitle
            onClick={() => {
              setPanelStatus({
                ...panelStatus,
                panel2: !panelStatus.panel2,
              });
            }}
            isActive={panelStatus.panel2}
            title="Policy"
          />

          <FooterListContent isActive={panelStatus.panel2}>
            Privacy Policy
            Return Policy
            Shipping Policy
            Terms of Use
          </FooterListContent>
        </li>

        <li>
          <FooterListTitle
            onClick={() => {
              setPanelStatus({
                ...panelStatus,
                panel3: !panelStatus.panel3,
              });
            }}
            isActive={panelStatus.panel3}
            title="Service"
          />
          <FooterListContent isActive={panelStatus.panel3}>
            About Us
            How to Personalised
          </FooterListContent>
        </li>

        <li>
          <FooterListTitle
            onClick={() => {
              setPanelStatus({
                ...panelStatus,
                panel4: !panelStatus.panel4,
              });
            }}
            isActive={panelStatus.panel4}
            title="Contact Us"
          />
          <FooterListContent isActive={panelStatus.panel4}>
            <p className="contact-email">
              contact@peasydeal.com
            </p>
          </FooterListContent>
        </li>
      </ul>

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
    </footer>
  );
}

export default Footer;