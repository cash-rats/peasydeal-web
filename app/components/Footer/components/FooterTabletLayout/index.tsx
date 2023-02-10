// import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
// import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import { HiOutlineFire } from 'react-icons/hi';
import { TextField } from '@mui/material';

import PeasyDealLOGO from './images/peasydeal_logo_white.svg';

const categoryList = [
  'Top Product',
  'New Trend',
  'Super Deal',
  'Clothes Accessories',
  'Kitchenware',
  'Clothes & Shoes',
  'Gardening',
  'electronic',
  'toy',
  'beauty & personal care',
  'pet',
  'home appliance',
  'health',
];

const companyDetails = [
  'about us',
  'careers',
  'privacy policy',
  'terms of service',
];

/*
  TODOs:
    Email subscribe function
*/
function FooterTabletLayout() {
  return (
    <div className="
      grid grid-cols-[1fr_130px_1fr_1fr_1fr] gap-12
    "
    >
      {/* Logo Section */}
      <div className="flex flex-col">
        <Link to="/">
          <img
            // className="w-full"
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
        </div>

        <div className="flex flex-col gap-[10px] mt-[10px]">
          {
            categoryList.map((cat, idx) => (
              <span
                key={idx}
                className="text-base text-white font-normal capitalize"
              >
                {cat}
              </span>
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
        <span className="text-white font-bold text-lg">
          company
        </span>

        <div className="flex flex-col gap-[10px] mt-[10px]">
          {
            companyDetails.map((info, idx) => (
              <span
                key={idx}
                className="text-base text-white font-normal capitalize"
              >
                {info}
              </span>
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
      </div>

    </div>
  );
}

export default FooterTabletLayout;