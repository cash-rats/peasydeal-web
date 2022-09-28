import type { LinksFunction } from '@remix-run/node';
import { TextField, } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { AiOutlineArrowRight } from 'react-icons/ai';

import styles from './styles/FooterContent.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export function PolicyContent() {
  return (
    <div>
      <div className="footer-content">
        <h3 className="content-title"> Policy </h3>
        <ul className="content-list">
          <li>
            <a>Privacy Policy</a>
          </li>
          <li>
            <a>
              Return Policy
            </a>
          </li>
          <li>
            <a>
              Shipping Policy
            </a>
          </li>
          <a>
            <li>Terms of Use</li>
          </a>
        </ul>
      </div>
    </div>
  );
}

export function ServiceContent() {
  return (
    <div className="footer-content">
      <h3 className="content-title"> Service </h3>
      <ul className="content-list">
        <li> <a> About Us</a> </li>
        <li> <a> Wholesale </a>  </li>
      </ul>
    </div>
  );
}

export function ContactUsContent() {
  return (
    <div className="footer-content">
      <h3 className="content-title"> Contact Us </h3>
      <p className="content-text"> contact@peasydeal.com </p>
    </div>
  );
}

export function SubscribeContent() {
  return (
    <div className="footer-content">
      <h3 className="content-title"> Subscribe </h3>
      <p className="news-letter"> Enter your email below to be the first to know about new collections and product launches. </p>
      <TextField
        fullWidth
        placeholder='Enter your email'
        variant='outlined'
        size='small'
        InputProps={{
          startAdornment: (
            <span style={{ paddingRight: '4px' }}>
              <EmailIcon
                color='action'
                fontSize='small'
              />
            </span>
          ),
          endAdornment: (
            <span style={{ paddingRight: '4px', cursor: 'pointer' }}>
              <AiOutlineArrowRight />
            </span>
          )
        }}
      />
    </div>

  )

}