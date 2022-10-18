import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
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
    <div className="footer-content">
      <h3 className="content-title"> Policy </h3>
      <ul className="content-list">
        <li>
          <Link to='/privacy'>Privacy Policy</Link>
        </li>
        <li>
          <Link to='/return-policy'>
            Return Policy
          </Link>
        </li>
        <li>
          <Link to='/shipping-policy'>
            Shipping Policy
          </Link>
        </li>
        <Link to='/terms-of-use'>
          <li>Terms of Use</li>
        </Link>
      </ul>
    </div>
  );
}

export function ServiceContent() {
  return (
    <div className="footer-content">
      <h3 className="content-title"> Service </h3>
      <ul className="content-list">
        <li> <Link to="/about-us"> About Us</Link> </li>
        <li> <Link to="/wholesale"> Wholesale </Link>  </li>
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