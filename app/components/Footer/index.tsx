import { useState } from 'react';
import type { LinksFunction } from '@remix-run/node';
import {
  TextField,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { BiChevronDown } from 'react-icons/bi';

import styles from './styles/Footer.css';
import Amex from './images/amex.svg';
import ApplePay from './images/apple_pay.svg';
import Discover from './images/pi_discover.svg';
import GooglePay from './images/google_pay.svg';
import MasterCard from './images/pi_master.svg';
import Visa from './images/visa.svg';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

function Footer() {
  return (
    <footer className="footer-container">
      <ul className="footer-list">
        <li className="footer-list-panel">
          <div className="footer-list-title">
            <h3>
              Subscribe
            </h3>
            <span>
              <BiChevronDown />
            </span>
          </div>
          <div className="list-content">
            <p>
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
          </div>
        </li>

        <li>
          <div className="footer-list-title">
            <h3>
              Policy
            </h3>
            <span>
              <BiChevronDown />
            </span>
          </div>
          <div className="list-content">
          </div>
        </li>

        <li>
          <div className="footer-list-title">
            <h3>
              Service
            </h3>
            <span>
              <BiChevronDown />
            </span>
          </div>
          <div className="list-content">
          </div>
        </li>

        <li>
          <div className="footer-list-title">
            <h3>
              Contact Us
            </h3>
            <span>
              <BiChevronDown />
            </span>
          </div>
          <div className="list-content">
          </div>
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