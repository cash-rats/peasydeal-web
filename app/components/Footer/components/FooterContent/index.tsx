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

const policies = [
  {
    to: '/privacy',
    title: 'Privacy Policy',
  },
  {
    to: '/return-policy',
    title: 'Return Policy',
  },
  {

    to: '/shipping-policy',
    title: 'Shipping Policy',
  },
  {
    to: '/terms-of-use',
    title: 'Terms of Use',
  },
];

export function PolicyContent() {
  return (
    <div className="text-[#666] md:pb-7">
      {/* <h3 className="content-title"> Policy </h3> */}
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block">
        Policy
      </h3>
      <ul className="list-none pl-0 flex flex-col items-start leading-4 md:leading-8">
        {
          policies.map((policy, index) => (
            <li
              key={index}
              className="py-[10px] cursor-pointer transition-all duration-300 text-base hover:text-[#000]"
            >
              <Link
                // prefetch='render'
                to={policy.to}
              >
                {policy.title}
              </Link>
            </li>
          ))

        }
      </ul>
    </div>
  );
}

const services = [
  {
    to: '/about-us',
    title: 'About Us',
  },
  {
    to: '/wholesale',
    title: 'Wholesale',
  },
];

export function ServiceContent() {
  return (
    <div className="text-[#666] md:pb-7">
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block"> Service </h3>
      <ul className="list-none pl-0 flex flex-col items-start leading-4">
        {
          services.map((service, index) => (
            <li
              className="py-[10px] cursor-pointer transition-all duration-300 text-base hover:text-[#000]"
              key={index}>
              <Link to={service.to}> {service.title}</Link> </li>
          ))

        }
      </ul>
    </div>
  );
}

export function ContactUsContent() {
  return (
    <div className="text-[#666] md:pb-7">
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block"> Contact Us </h3>
      <p className="font-medium text-base"> contact@peasydeal.com </p>
    </div>
  );
}

export function SubscribeContent() {
  return (
    <div className="text-[#666] md:pb-7">
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block"> Subscribe </h3>
      <p className="py-2 font-medium text-base">
        Enter your email below to be the first to know about new collections and product launches.
      </p>
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