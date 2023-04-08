import { Link } from '@remix-run/react';
import Button from '@mui/material/Button';
import { HiOutlineFire } from 'react-icons/hi';

import type { Category } from '~/shared/types';

import LogoSection from '../LogoSection';
import EmailSubscribe from '../EmailSubscribe';
import ResourceSection from '../ResourceSection';
import CompanySection from '../CompanySection';

/*
  TODOs:
    Email subscribe function
*/
interface FooterTabletLayoutProps {
  categories?: Category[];
}

function FooterTabletLayout({ categories = [] }: FooterTabletLayoutProps) {
  return (
    <div className="
      grid grid-cols-4 gap-12
      border-b-[1px] border-b-[#2E4E73] pb-4
    ">
      {/* Logo Section */}
      <LogoSection />

      {/* Product Section */}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg">
          Product
        </span>

        <div className="mt-[10px]">
          <Link to={'/promotion/hot_deal'}>
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
              <Link
                key={idx}
                to={
                  category.type === 'promotion'
                    ? `/promotion/${category.name}`
                    : `/${category.name}`
                }
              >
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
      {/* <ResourceSection /> */}

      {/* Company */}
      <CompanySection />

      {/*Get free shipping code*/}
      <EmailSubscribe />
    </div>
  );
}

export default FooterTabletLayout;