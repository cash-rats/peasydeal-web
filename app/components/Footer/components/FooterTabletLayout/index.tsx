import type { Category } from '~/shared/types';

import CustomerSupport from './CustomerSupport';
import OurPolicies from './OurPolicies';

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
      grid grid-cols-2 gap-12
      px-4 py-8
      md:grid-cols-3
      border-b-[1px] border-b-[#2E4E73] pb-4
    ">
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg uppercase">
          Our Policies
        </span>
        <OurPolicies />
      </div>

      <div className="flex flex-col">
        <span className="text-white font-bold text-lg uppercase">
          Customer Support
        </span>
        <CustomerSupport />
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-white font-bold text-lg uppercase">
          Contact us
        </span>

        <div className="flex flex-col gap-[10px] mt-[10px]">
          <span className="text-base text-white font-normal capitalize">
            <b className='mr-2'>Address: </b><br />5th Floor, 167, 169 Great Portland St, London W1W 5PF, United Kingdom
          </span>
          <span className="text-base text-white font-normal capitalize">
            <b className='mr-2'>Email: </b><br /> contact@peasydeal.com
          </span>
          <span className="text-base text-white font-normal capitalize">
            <b className='mr-2'>Phone: </b><br /> +44 7458 149925
          </span>
          <span className="text-base text-white font-normal capitalize">
            <b className='mr-2'>Company Number: </b><br /> 13923560
          </span>
        </div>
      </div>

      {/* Product Section */}
      {/* <div className="flex flex-col">
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
                    : `/collection/${category.name}`
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
      </div > */}
    </div>
  );
}

export default FooterTabletLayout;