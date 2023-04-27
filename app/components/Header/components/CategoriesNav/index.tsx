import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import { useCallback, useEffect, useRef, useState } from "react";

import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { VscFlame, VscChevronDown, VscChevronUp } from "react-icons/vsc";

import type { Category } from '~/shared/types';
import MegaMenu, { links as MegaMenuLink } from './MegaMenu';
import MegaMenuContent, { links as MegaMenuContentLink } from '../MegaMenuContent';

export const links: LinksFunction = () => {
  return [
    ...MegaMenuContentLink(),
    ...MegaMenuLink(),
  ];
}

interface CategoriesNavProps {
  categories?: Array<Category>,
  topCategories?: Array<Category>,
};

export default function CategoriesNav({ categories = [], topCategories = [] }: CategoriesNavProps) {
  const ALL_CATEGORIES = 'ALL';
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [activeMenuName, setActiveMenuName] = useState<string | null>(null);
  const ulRef = useRef<HTMLElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeMenuName !== ALL_CATEGORIES) {
      setIsOpen(false);
    }
  }, [activeMenuName]);

  const setOpen = () => {
    setMenuDisplayed(true, ALL_CATEGORIES);
    setIsOpen(true);
  }

  const setClose = () => {
    setMenuDisplayed(false, ALL_CATEGORIES);
    setIsOpen(false);
  }

  const setMenuDisplayed = useCallback((show: boolean, name: string) => {
    setDisplayOverlay(show);
    setActiveMenuName(name);
  }, [setDisplayOverlay])

  return (
    <div
      className={`
        hidden md:flex
        flex-col justify-center items-center
        max-w-screen-xl w-full
        mx-1 md:mx-4 my-auto
        relative
      `}
    >
      <div className="flex relative items-center flex-auto w-full">
        <nav className="flex-auto relative" ref={ulRef}>
          <ul id="mega-nav-bar" className={`
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
                  key={`${index}_menu_link`}
                  state={{ scrollToTop: true }}
                  to={
                    category.type === 'promotion'
                      ? `/promotion/${category.name}`
                      : `/collection/${category.name}`
                  }
                  className="self-center"
                >
                  {
                    index === 0
                      ? (
                        <li className={`
                          cursor-pointer
                          flex-auto
                          self-center
                          transition
                          text-center lg:text-left xl:text-center
                          text-xs md:text-sm xl:text-base
                          nowrap
                          px-1 lg:px-2 xl:px-2
                          py-2 md:py-2 lg:py-4
                          bg-[#EA4335] text-white items-center font-semibold flex flex-row
                        `}>
                          <VscFlame className="mr-1" />
                          <span>{category.shortName || category.title}</span>
                        </li>
                      ) : (
                        <li className="CategoriesNav__item fromLeft self-center">
                          <MegaMenu
                            category={category}
                            setMenuDisplayed={setMenuDisplayed}
                            activeMenuName={activeMenuName}
                          />
                        </li>
                      )
                  }
                </Link>
              ))
            }

            <li className="self-center ">
              <div className="mega-menu-wrapper">
                <Menu isOpen={isOpen} gutter={0} id="all-mega-menu" isLazy={true}>
                  <MenuButton
                    variant="ghost"
                    borderRadius={5}
                    aria-label="ALL"
                    fontWeight="normal"
                    onTouchEnd={e => {
                      e.preventDefault();
                      isOpen ? setClose() : setOpen();
                    }}
                    onMouseEnter={setOpen}
                    onMouseLeave={setClose}
                    onClick={e => {
                      isOpen ? setClose() : setOpen();
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
                    onMouseEnter={setOpen}
                    onMouseLeave={setClose}
                    minW="0"
                    className='
                      flex
                      w-[100vw] max-w-screen-xl
                      shadow-[2px_4px_16px_rgb(0,0,0,8%)]
                    '
                  >
                    <MegaMenuContent
                      categories={categories}
                      onClose={setClose}
                      ItemNode={MenuItem}
                    />
                  </MenuList>
                </Menu>
              </div>
            </li>

          </ul>
        </nav>
      </div>
      <div
        className={`${isOpen || displayOverlay ? "megamenu-overlay" : ''}`}
        onClickCapture={() => {
          setDisplayOverlay(false);
          setActiveMenuName('');
        }}
      />
    </div>
  );
}
