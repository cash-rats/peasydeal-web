import {
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"

import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { VscFlame, VscChevronDown, VscChevronUp } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import MegaMenuContent, { links as MegaMenuContentLink } from '../MegaMenuContent';

export const links: LinksFunction = () => {
  return [
    ...MegaMenuContentLink(),
  ];
}

interface CategoriesNavProps {
  categories?: Array<Category>,
  topCategories?: Array<Category>,
};

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
                  key={index}
                  state={{ scrollToTop: true }}
                  to={
                    category.name === 'hot_deal'
                      ? `/promotion/${category.name}`
                      : `/${category.name}`
                  }
                  className="self-center"
                >
                  <li className={`
                    CategoriesNav__item
                    fromLeft

                    cursor-pointer
                    flex-auto
                    self-center
                    transition
                    text-center lg:text-left xl:text-center

                    text-xs md:text-sm xl:text-base
                    nowrap
                    px-1 lg:px-2 xl:px-2
                    py-2 md:py-2 lg:py-4
                    ${index === 0 ? 'bg-[#EA4335] text-white items-center font-semibold flex flex-row' : ''}
                  `}>
                    {index === 0 ? <VscFlame className="mr-1" /> : null}
                    <span>{category.title}</span>
                  </li>
                </Link>
              ))
            }
            <li className="self-center">
              <Menu isOpen={isOpen} gutter={0}>
                <MenuButton
                  variant="ghost"
                  borderRadius={5}
                  aria-label="Courses"
                  fontWeight="normal"
                  onMouseEnter={onOpen}
                  onMouseLeave={onClose}
                  onClick={e => {
                    e.preventDefault();
                    isOpen ? onClose() : onOpen();
                  }}
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
                  <MegaMenuContent
                    categories={categories}
                    onClose={onClose}
                    ItemNode={MenuItem}
                  />
                </MenuList>
              </Menu>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}
