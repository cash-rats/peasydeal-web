import { Link } from '@remix-run/react';
import Button from '@mui/material/Button';
import { HiOutlineFire } from 'react-icons/hi';
import { TextField } from '@mui/material';

import type { Category } from '~/shared/types';

import LogoSection from '../LogoSection';
import EmailSubscribe from '../EmailSubscribe';

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
      <LogoSection />

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

        <span className="text-base text-white font-normal capitalize">
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
      <EmailSubscribe />
    </div>
  );
}

export default FooterTabletLayout;