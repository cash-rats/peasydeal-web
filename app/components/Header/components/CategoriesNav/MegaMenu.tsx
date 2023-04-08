import React, { useEffect, useState } from 'react'
import { Link } from '@remix-run/react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from "@chakra-ui/react"
import { VscArrowRight } from "react-icons/vsc";
import type { Category } from '~/shared/types';

import type { LinksFunction } from '@remix-run/node';

import styles from './styles/MegaMenu.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
}


interface IMegaMenu {
  category: Category;
  setMenuDisplayed: (show: boolean, name: string) => void;
  activeMenuName: string | null;
}

const MegaMenu = ({ category, setMenuDisplayed, activeMenuName }: IMegaMenu) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeMenuName !== category.name) {
      setIsOpen(false);
    }
  }, [activeMenuName, category]);

  const setOpen = () => {
    setMenuDisplayed(true, category.name);
    setIsOpen(true);
  }

  const setClose = () => {
    setMenuDisplayed(false, category.name);
    setIsOpen(false);
  }

  return (
    <div className='mega-menu-wrapper'>
      <Menu
        isOpen={isOpen}
        gutter={0}
        id={category.name}
        isLazy={true}
      >
        <MenuButton
          variant="ghost"
          borderRadius={5}
          aria-label={category.name}
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
            w-full
          "
        >
          <div className="flex items-center">
            <span>{category.shortName || category.title}</span>
          </div>
        </MenuButton>

        <Portal>

          <MenuList
            onMouseEnter={setOpen}
            onMouseLeave={setClose}
            minW="0"
            className='
              flex
              w-[100vw]
              max-w-screen-xl
              pt-4 pb-8 xl:py-8 px-4
              shadow-[2px_4px_16px_rgb(0,0,0,8%)]
              overflow-scroll
              md:max-h-[calc(100vh-8rem)] lg:max-h-auto
            '
          >
            <div className="flex flex-col px-3 w-full">
              <div className="
                grid
                w-full
                grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
              ">
                <MenuItem as="div" className="flex items-center p-0 w-full col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
                  <Link
                    // prefetch='intent'
                    state={{ scrollToTop: true }}
                    to={`/${category.name}`}
                    className="w-full self-center"
                    onClick={setClose}
                  >
                    <Button variant='link' colorScheme='pink' size="lg" rightIcon={<VscArrowRight />}>
                      <span className="ml-2 text-lg">Shop all {category.shortName || category.title} ({category.count})</span>
                    </Button>
                  </Link>
                </MenuItem>
                <div className="pt-3 col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
                  <hr className="my-1 h-[1px] w-full bg-slate-50" />
                </div>
                {
                  category.children.length > 0 && category.children.map((child, index) => {
                    if (child.count === 0) return null;

                    return (
                      <div
                        key={index}
                        className="flex flex-start flex-col mt-4 xl:mt-8 pr-10"
                      >
                        <Link
                          // prefetch='intent'
                          state={{ scrollToTop: true }}
                          to={`/${child.name}`}
                          className="w-full self-center"
                          onClick={setClose}
                        >
                          <MenuItem as="div" className="flex items-center p-0">
                            <Button variant='link' colorScheme='pink' size="lg">
                              <span className="ml-2 text-lg whitespace-normal text-left">{child.label} ({child.count})</span>
                            </Button>
                          </MenuItem>
                        </Link>
                        <div className="py-0 xl:py-1">
                          <hr className="my-1 h-[1px] w-full bg-slate-50" />
                        </div>
                        {
                          child.children.length > 0 && child.children.map((subChild, _index) => {
                            if (subChild.count === 0) return null;

                          return (
                              <div
                                key={_index}
                                className="flex flex-start py-0 xl:py-1"
                              >
                                <Link
                                  // prefetch='intent'
                                  state={{ scrollToTop: true }}
                                  to={`/${subChild.name}`}
                                  className="w-full self-center"
                                  onClick={setClose}
                                >
                                  <MenuItem as="div" className="flex items-center p-0">
                                    <Button variant='link'>
                                      <span className="ml-2 text-base font-normal text-[#1a202c]">{subChild.label} ({subChild.count})</span>
                                    </Button>
                                  </MenuItem>
                                </Link>
                              </div>
                            );
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </MenuList>
        </Portal>
      </Menu>
    </div>
  )
}

export default MegaMenu;