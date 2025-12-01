
import { Link } from 'react-router';
import type { LinksFunction } from 'react-router';
import { VscFlame, VscArrowRight } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import AnnouncementBanner from "../AnnouncementBanner";
import styles from './styles/MegaMenuContent.css?url';
import { Button } from '~/components/ui/button';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
}

const iconMapper = (name: string) => {
  switch (name) {
    case 'hot_deal':
      return <VscFlame className='text-[20px] text-[#e90064] relative' />;
    default:
      return null;
  }
}

export interface IMegaMenuContent {
  categories: Category[];
  onClose: () => void;
  ItemNode: any;
}

const MegaMenuContent = ({
  categories,
  onClose,
  ItemNode,
}: IMegaMenuContent) => {
  return (
    <div className="flex flex-col p-3 w-full">
      <div className="
        grid
        w-full
        gap-1 md:gap-2 lg:gap-2
        grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
      ">
        {
          categories.map((category, index) => {
            const { name, type, title, count } = category || {};

            return (
              <div
                key={index}
                className="
                  flex flex-start
                  py-2
                "
              >
                <Link
                  // prefetch='intent'
                  to={
                    type === 'promotion'
                      ? `/promotion/${name}`
                      : `/collection/${name}`

                  }
                  className="w-full self-center"
                  onClick={onClose}
                >
                  <ItemNode className="flex items-center">
                    <span>{iconMapper(name)}</span>
                    <span className="ml-2 text-base">{title} {count ? `(${count})` : ''}</span>
                  </ItemNode>
                </Link>
              </div>
            );
          })
        }
      </div>
      <div className="p-3">
        <hr className="my-1 h-[1px] w-full bg-slate-50" />
      </div>

      <div
        className="
          px-0 md:px-3
          grid
          gap-2 md:gap-2 lg:gap-2
          grid-cols-1 md:grid-cols-3
        ">
        <div>
          <Link to={`/promotion/super_deal`}>
            <Button
              variant='outline'
              size='lg'
              onClick={onClose}
              className="text-base md:text-md xl:text-lg w-full justify-between border-pink-500 text-pink-600 hover:text-pink-700"
            >
              <span>
                SUPER DEAL <span className="ml-1 text-[#fc1d7a]">EXTRA 10% OFF</span>
              </span>
              <VscArrowRight className='flex md:hidden xl:flex' />
            </Button>
          </Link>
        </div>
        <div>
          <Link to={`/promotion/deal_under_15`}>
            <Button
              onClick={onClose}
              variant='outline'
              size='lg'
              className="text-base md:text-md xl:text-lg w-full justify-between border-pink-500 text-pink-600 hover:text-pink-700"
            >
              <span>
                Deal from <span className="ml-1 text-[#fc1d7a]">£0.99 - £15</span>
              </span>
              <VscArrowRight className='flex md:hidden xl:flex' />
            </Button>
          </Link>
        </div>
        <div>
          <Link to={`/promotion/weekly_deals`}>
            <Button
              onClick={onClose}
              variant='outline'
              size='lg'
              className="text-base md:text-md xl:text-lg w-full justify-between border-pink-500 text-pink-600 hover:text-pink-700"
            >
              <span>
                Weekly <span className="ml-1 text-[#fc1d7a]">Best Seller</span>
              </span>
              <VscArrowRight className='flex md:hidden xl:flex' />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-3 hidden md:flex">
        <hr className="my-1 h-[1px] w-full bg-slate-50" />
      </div>

      <div className="hidden md:flex px-0 md:px-3">
        <AnnouncementBanner open={true} hideCloseButton />
      </div>

    </div>
  )
}

export default MegaMenuContent;
