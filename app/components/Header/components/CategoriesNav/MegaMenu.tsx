import { useEffect, useState } from 'react'
import { Link } from 'react-router';
import type { LinksFunction } from 'react-router';

import { VscArrowRight } from "react-icons/vsc";
import type { Category } from '~/shared/types';

import styles from './styles/MegaMenu.css?url';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';

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

let delayOpenID: undefined | ReturnType<typeof setTimeout> = undefined;
let delayCloseID: undefined | ReturnType<typeof setTimeout> = undefined;

const MegaMenu = ({ category, setMenuDisplayed, activeMenuName }: IMegaMenu) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeMenuName !== category.name) {
      setIsOpen(false);
    }
  }, [activeMenuName, category]);

  const setOpen = () => {
    if (delayCloseID) {
      clearTimeout(delayCloseID);
      delayCloseID = undefined;
    }
    setMenuDisplayed(true, category.name);
    setIsOpen(true);
  }

  /**
   * Invoke `setOpen` after user intended to open
   * menu panel. After cursuor is on top of the item
   * for 300 milli-seconds we can confirm that the user
   * has the intention to open the panel.
   */
  const setDelayOpen = () => {
    if (delayOpenID) clearTimeout(delayOpenID);
    if (delayCloseID) {
      clearTimeout(delayCloseID);
      delayCloseID = undefined;
    }
    delayOpenID = setTimeout(setOpen, 300);
  }

  const setDelayClose = () => {
    if (delayOpenID) {
      clearTimeout(delayOpenID);
      delayOpenID = undefined;
    }
    if (delayCloseID) clearTimeout(delayCloseID);
    delayCloseID = setTimeout(() => {
      setMenuDisplayed(false, category.name);
      setIsOpen(false);
      delayCloseID = undefined;
    }, 150);
  }

  const setClose = () => {
    if (delayOpenID) {
      clearTimeout(delayOpenID);
      delayOpenID = undefined;
    }
    if (delayCloseID) {
      clearTimeout(delayCloseID);
      delayCloseID = undefined;
    }
    setMenuDisplayed(false, category.name);
    setIsOpen(false);
  }

  return (
    <div className='mega-menu-wrapper'>
      <DropdownMenu
        modal={false}
        open={isOpen}
        onOpenChange={(open) => (open ? setOpen() : setClose())}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label={category.name}
            className="
              text-sm lg:text-base
              px-0 lg:px-2
              py-2 md:py-4
              flex flex-col
              items-center relative
              w-full
            "
            onTouchEnd={e => {
              e.preventDefault();
              isOpen ? setClose() : setOpen();
            }}
            onMouseEnter={setDelayOpen}
            onMouseLeave={setDelayClose}
          >
            <div className="flex items-center">
              <span>{category.shortName || category.title}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          sideOffset={12}
          onMouseEnter={setOpen}
          onMouseLeave={setDelayClose}
          className='
            mega-menu-content
            flex
            w-[100vw]
            max-w-screen-xl
            bg-white
            pt-4 pb-8 xl:py-8 px-4
            shadow-[2px_4px_16px_rgb(0,0,0,8%)]
            overflow-scroll
            md:max-h-[calc(100vh-8rem)] lg:max-h-auto
            z-[9999]
          '
        >
          <div className="flex flex-col px-3 w-full">
            <div className="
              grid
              w-full
              grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
            ">
              <div className="flex items-center p-0 w-full col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
                <Link
                  // prefetch='intent'
                  to={`/collection/${category.name}`}
                  className="w-full self-center"
                  onClick={setClose}
                >
                  <Button
                    variant='link'
                    size="lg"
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <span className="ml-2 text-lg">
                      Shop all {category.shortName || category.title} ({category.count})
                    </span>
                    <VscArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
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
                        to={`/collection/${child.name}`}
                        className="w-full self-center"
                        onClick={setClose}
                      >
                        <div className="flex items-center p-0">
                          <Button variant='link' size="lg" className="text-pink-600 hover:text-pink-700">
                            <span className="ml-2 text-lg whitespace-normal text-left">
                              {child.label} ({child.count})
                            </span>
                          </Button>
                        </div>
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
                                to={`/collection/${subChild.name}`}
                                className="w-full self-center"
                                onClick={setClose}
                              >
                                <div className="flex items-center p-0">
                                  <Button variant='link' className="text-[#1a202c] hover:text-[#0f172a]">
                                    <span className="ml-2 text-base font-normal text-[#1a202c]">{subChild.label} ({subChild.count})</span>
                                  </Button>
                                </div>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MegaMenu;
