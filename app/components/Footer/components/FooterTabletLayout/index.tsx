import { Link } from '@remix-run/react';
import Button from '@mui/material/Button';
import { HiOutlineFire } from 'react-icons/hi';
import { TextField } from '@mui/material';

import type { Category } from '~/shared/types';

import PeasyDealLOGO from './images/peasydeal_logo_white.svg';
import Amex from './images/american-express.svg';
import Visa from './images/visa.svg';
import MasterCard from './images/mastercard.svg';
import Paypal from './images/paypal.svg';
import Klarna from './images/klarna-1.svg';

const companyDetails = [
  {
    label: 'about us',
    link: '/about-us',
  },
  {
    label: 'privacy policy',
    link: '/privacy',
  },
  {
    label: 'return policy',
    link: '/return-policy',
  },
  {
    label: 'shipping policy',
    link: '/shipping-policy',
  },
  {
    label: 'termins of service',
    link: '/terms-of-use',
  },
  {
    label: 'whalesale',
    link: '/wholesale',
  },
  {
    label: 'career',
    link: '/',
  }
];

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

/*
  TODOs:
    Email subscribe function
*/

interface FooterTabletLayoutProps {
  categories?: Category[];
}

function FooterTabletLayout({ categories = [] }: FooterTabletLayoutProps) {
  return (
    <div className="grid grid-cols-[1fr_130px_1fr_1fr_1fr] gap-12">
      {/* Logo Section */}
      <div className="flex flex-col">
        <Link to="/">
          <img
            width={220}
            height={85}
            alt="peasydeal"
            src={PeasyDealLOGO}
          />
        </Link>

        <p className="
          w-full
        text-[#f7f7ee] text-lg capitalize mt-4
        ">
          Shop with us for the best deals on the web - unbeatable prices and weekly updates
        </p>
      </div>

      {/* Product Section */}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg">
          Product
        </span>

        <div className="mt-[10px]">
          <Link to={'/hot_deal'}>
            <Button
              style={{
                backgroundColor: '#d85140',
                fontSize: '1rem',
              }}
              size='small'
              variant='contained'
              startIcon={<HiOutlineFire />}
            >
              hot deal
            </Button >
          </Link>
        </div>

        <div className="flex flex-col gap-[10px] mt-[10px]">
          {
            categories.map((category, idx) => (
              <Link key={idx} to={`/${category.name}`}>
                <span
                  className="text-base text-white font-normal capitalize"
                >
                  {category.title}
                </span>
              </Link>
            ))
          }
        </div>
      </div >

      {/* Resources */}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg">
          Resources
        </span>

        <span className="text-base text-white font-normal capitalize"
        >
          blog
        </span>
      </div>

      {/* Company */}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg capitalize">
          company
        </span>

        <div className="flex flex-col gap-[10px] mt-[10px]">
          {
            companyDetails.map((info, idx) => (
              <Link
                to={info.link}
                key={idx}
              >
                <span
                  key={idx}
                  className="text-base text-white font-normal capitalize"
                >
                  {info.label}
                </span>
              </Link>
            ))
          }
        </div>
      </div>

      {/*Get free shipping code*/}
      <div className="flex flex-col">
        <span className="
        text-white font-bold text-3xl
          capitalize
        ">
          get free shipping code
        </span>

        <p className="text-white mt-4 text-base">
          Join to our news letter & get £2.99 worth Free Shipping Code
        </p>

        <div className="flex flex-row mt-3 w-full gap-2">
          <div className="w-[200px] 1200-[268px]">
            <TextField
              fullWidth
              placeholder='Enter Your Email Address'
              variant='outlined'
              size='small'
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
            />
          </div>

          <Button
            variant='contained'
            style={{
              borderRadius: '10px',
              textTransform: 'capitalize',
              backgroundColor: '#d02e7d',
              fontSize: '1rem',
            }}
          >
            Subscribe
          </Button>
        </div>

        <p className="text-white mt-3 text-base font-bold">
          * Can be use on order £20+, expires at March, 31, 2023
          Terms and Condition applied
        </p>

        {/*
          List of payment channels
          - visa
          - amex
          - master card
          - paypal
          - klarna
        */}
        <span className="text-white font-bold text-lg mt-6 capitalize">
          payment channels
        </span>

        <ul className="list-none flex flex-row mt-2">
          {
            paymentMethod.map((m, idx) => (
              <li
                className="w-9 h-6 m-[0.625rem]"
                key={idx}
              >
                <img
                  alt={m.alt}
                  src={m.src}
                />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default FooterTabletLayout;