import { Button } from '@chakra-ui/react';

import {
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react"

import { IoBody, IoSparklesOutline, IoPricetagsOutline } from 'react-icons/io5';
import { MdOutlinePets, MdOutlineSmartToy } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';
import { RiShirtFill } from 'react-icons/ri';
import { GiPearlNecklace, GiFlowerPot, GiLipstick } from 'react-icons/gi';
import { FcRating, FcSmartphoneTablet, FcHome, FcAutomotive } from 'react-icons/fc';

import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { VscFlame, VscChevronDown, VscChevronUp, VscArrowRight } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import AnnouncementBanner from "../AnnouncementBanner";

import styles from './styles/CategoriesNav.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
}

interface CategoriesNavProps {
  categories?: Array<Category>,
  topCategories?: Array<Category>,
};

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

/*
 * - [x] Hover over all category should display all category list.
 * - [ ] If we have too many categories, we should have a scroll view.
 * - [ ]
 */
export default function CategoriesNav({ categories = [], topCategories = [] }: CategoriesNavProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className={`
      hidden md:flex
      flex-col justify-center items-center
      max-w-screen-xl w-full
      mx-1 md:mx-4 my-auto
    `}>
      <div className="flex relative items-center flex-auto w-full">
        {/* categories nav */}
        <nav className="flex-auto">
          <ul className={`
            flex flex-auto
            list-none
            space-x-1
            md:space-x-2
            xl:space-x-4
            align-center
            justify-between
            p-0 m-0`}>
            {
              topCategories.map((category, index) => (
                <Link
                  replace
                  key={category.catId}
                  state={{ scrollToTop: true }}
                  to={`/${category.name}`}
                  className="self-center"
                >
                  <li className={`
                    CategoriesNav__item
                    fromLeft

                    cursor-pointer
                    flex-auto
                    self-center
                    transition
                    text-center

                    text-xs md:text-sm lg:text-base
                    px-1 lg:px-2 xl:px-2 2xl:px-2
                    py-2 md:py-4
                    ${index === 0 ? 'bg-[#EA4335] text-white items-center font-semibold flex flex-row' : ''}
                  `}>
                    {index === 0 ? <VscFlame className="mr-1" /> : null}
                    <span>{category.title}</span>
                  </li>
                </Link>
              ))
            }
            <li>
              <Menu isOpen={isOpen} gutter={0}>
                <MenuButton
                  variant="ghost"
                  borderRadius={5}
                  aria-label="Courses"
                  fontWeight="normal"
                  onMouseEnter={onOpen}
                  onMouseLeave={onClose}
                  onClick={e => { e.preventDefault(); }}
                  className="
                    text-sm lg:text-base
                    px-0 lg:px-2
                    py-2 md:py-4
                    flex flex-col
                    items-center relative
                  "
                >
                  <div className="flex items-center">
                    <span className="mr-1">ALL</span>
                    {isOpen ? <VscChevronUp className="text-lg" /> : <VscChevronDown className="text-lg" />}
                  </div>
                </MenuButton>
                <MenuList
                  onMouseEnter={onOpen}
                  onMouseLeave={onClose}
                  className='
                    md:w-[90vw] lg:w-[80vw] max-w-screen-xl flex
                    shadow-[2px_4px_16px_rgb(0,0,0,8%)]
                  '
                >
                  <div className="flex flex-col p-3 w-full">
                    <div className="
                      grid
                      w-full
                      gap-1 md:gap-2 lg:gap-2
                      grid-cols-3 md:grid-cols-3 lg:grid-cols-4
                    ">
                      {
                        categories.map((category) => {
                          return (
                            <div
                              key={category.catId}
                              className="flex flex-start">
                              <Link
                                // prefetch='intent'
                                state={{ scrollToTop: true }}
                                to={`/${category.name}`}
                                className="w-full"
                                onClick={onClose}
                              >
                                <MenuItem className="flex items-center">
                                  <span>{iconMapper(category.name)}</span>
                                  <span className="ml-2 text-base">{category.title}</span>
                                </MenuItem>
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
                        px-3
                        grid
                        gap-1 md:gap-2 lg:gap-2
                        grid-cols-3
                      ">
                        <div>
                          <Link to={`/super_deal`}>
                            <Button
                              rightIcon={<VscArrowRight />}
                              colorScheme='pink'
                              variant='outline'
                              size='lg'
                              width='100%'
                              onClick={onClose}
                            >
                              SUPER DEAL <span className="ml-1 text-[#fc1d7a]">EXTRA 10% OFF</span>
                            </Button>
                          </Link>
                        </div>
                        <div>
                          <Link to={`/promotion/deal_under_15`}>
                            <Button
                              rightIcon={<VscArrowRight />}
                              colorScheme='pink'
                              variant='outline'
                              size='lg'
                              width='100%'
                              onClick={onClose}
                            >
                              Deal from <span className="ml-1 text-[#fc1d7a]">£0.99 - £15</span>
                            </Button>
                          </Link>
                        </div>
                        <div>
                          <Link to={`/promotion/weekly_deals`}>
                            <Button
                              rightIcon={<VscArrowRight />}
                              colorScheme='pink'
                              variant='outline'
                              size='lg'
                              width='100%'
                              onClick={onClose}
                            >
                              Weekly <span className="ml-1 text-[#fc1d7a]">Best Seller</span>
                            </Button>
                          </Link>
                        </div>
                    </div>

                    <div className="p-3">
                      <hr className="my-1 h-[1px] w-full bg-slate-50" />
                    </div>

                    <div className="px-3">
                      <AnnouncementBanner open={true} hideCloseButton />
                    </div>

                  </div>
                </MenuList>
              </Menu>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}
