
import { Button } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

import { IoBody, IoSparklesOutline, IoPricetagsOutline } from 'react-icons/io5';
import { MdOutlinePets, MdOutlineSmartToy } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';
import { RiShirtFill } from 'react-icons/ri';
import { GiPearlNecklace, GiFlowerPot, GiLipstick } from 'react-icons/gi';
import { FcRating, FcSmartphoneTablet, FcHome, FcAutomotive } from 'react-icons/fc';

import type { LinksFunction } from '@remix-run/node';
import { VscFlame, VscArrowRight } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import AnnouncementBanner from "../AnnouncementBanner";
import styles from './styles/MegaMenuContent.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
}

const iconMapper = (name: string) => {
  switch (name) {
    case 'hot_deal':
      return <VscFlame className='text-[20px] text-[#e90064] relative' />;
    case 'new_trend':
      return <IoSparklesOutline className='text-[20px] text-[#FF8B13]' />;
    case 'super_deal':
      return <IoPricetagsOutline className='text-[20px] text-[#EB455F]' />;
    case 'pet':
      return <MdOutlinePets className='text-[20px] text-[#BAD7E9] relative' />;
    case 'kitchen_kitchenware':
      return <TbToolsKitchen2 className='text-[20px] text-[#10A19D] relative' />;
    case 'clothes_shoes':
      return <RiShirtFill className='text-[20px] text-[#FF8787] relative' />;
    case 'garden':
      return <GiFlowerPot className='text-[20px] text-[#8BDB81] relative' />;
    case 'electronic':
      return <FcSmartphoneTablet className='text-[20px] relative' />;
    case 'toy':
      return <MdOutlineSmartToy className='text-[20px] text-[#FFE162] relative' />;
    case 'beauty_personal_care':
      return <GiLipstick className='text-[20px] text-[#FFA6D5] relative' />;
    case 'home_appliances':
      return <FcHome className='text-[20px] relative' />;
    case 'health_medical':
      return <IoBody className='text-[20px] text-[#39A388] relative' />;
    case 'car_accessories':
      return <FcAutomotive className='text-[20px] relative' />;
    case 'cloths_accessories':
      return <GiPearlNecklace className='text-[20px] text-[#FF8474] relative' />;
    case 'top_product':
      return <FcRating className='text-[20px] relative' />;
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
                  state={{ scrollToTop: true }}
                  to={`/${category.name}`}
                  className="w-full self-center"
                  onClick={onClose}
                >
                  <ItemNode className="flex items-center">
                    <span>{iconMapper(category.name)}</span>
                    <span className="ml-2 text-base">{category.title}</span>
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
              rightIcon={<VscArrowRight className='flex md:hidden xl:flex' />}
              colorScheme='pink'
              variant='outline'
              size='lg'
              width='100%'
              onClick={onClose}
              className="text-base md:text-md xl:text-lg"
            >
              SUPER DEAL <span className="ml-1 text-[#fc1d7a]">EXTRA 10% OFF</span>
            </Button>
          </Link>
        </div>
        <div>
          <Link to={`/promotion/deal_under_15`}>
            <Button
              rightIcon={<VscArrowRight className='flex md:hidden xl:flex' />}
              colorScheme='pink'
              variant='outline'
              size='lg'
              width='100%'
              onClick={onClose}
              className="text-base md:text-md xl:text-lg"
            >
              Deal from <span className="ml-1 text-[#fc1d7a]">£0.99 - £15</span>
            </Button>
          </Link>
        </div>
        <div>
          <Link to={`/promotion/weekly_deals`}>
            <Button
              rightIcon={<VscArrowRight className='flex md:hidden xl:flex' />}
              colorScheme='pink'
              variant='outline'
              size='lg'
              width='100%'
              onClick={onClose}
              className="text-base md:text-md xl:text-lg"
            >
              Weekly <span className="ml-1 text-[#fc1d7a]">Best Seller</span>
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