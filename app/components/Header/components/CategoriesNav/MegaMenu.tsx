import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { VscArrowRight, VscChevronRight } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface IMegaMenu {
  category: Category;
  topCategories: Category[];
  navBounds?: { bottom: number } | null;
  setMenuDisplayed: (show: boolean, name: string) => void;
  activeMenuName: string | null;
}

let delayOpenID: undefined | ReturnType<typeof setTimeout> = undefined;
let delayCloseID: undefined | ReturnType<typeof setTimeout> = undefined;

const MegaMenu = ({ category, topCategories = [], navBounds, setMenuDisplayed, activeMenuName }: IMegaMenu) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRail, setActiveRail] = useState(category.name);

  useEffect(() => {
    if (activeMenuName !== category.name) {
      setIsOpen(false);
    }
  }, [activeMenuName, category.name]);

  useEffect(() => {
    setActiveRail(category.name);
  }, [category.name]);

  const currentCategory = useMemo(() => {
    return topCategories.find(({ name }) => name === activeRail) || category;
  }, [activeRail, topCategories, category]);

  const setOpen = () => {
    if (delayCloseID) {
      clearTimeout(delayCloseID);
      delayCloseID = undefined;
    }
    setMenuDisplayed(true, category.name);
    setActiveRail(category.name);
    setIsOpen(true);
  }

  /**
   * Invoke `setOpen` after user intended to open
   * menu panel. After cursor is on top of the item
   * for 300 milliseconds we can confirm that the user
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
    <div>
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

      {isOpen && (
        <div
          onMouseEnter={setOpen}
          onMouseLeave={setDelayClose}
          className="
            absolute
            left-0
            flex
            border border-gray-100
            bg-white
            p-0
            shadow-[0_14px_40px_rgba(0,0,0,0.08)]
            overflow-hidden
            md:max-h-[calc(100vh-8rem)]
            z-[9999]
            rounded-b-xl
          "
          style={{
            width: '100vw',
            minWidth: '100vw',
            left: 0,
            top: navBounds?.bottom ?? 0,
          }}
        >
          <div className="flex w-full">
            <div className="w-60 bg-white border-r border-gray-200 py-2">
              {topCategories.map((cat) => {
                if (cat.count === 0) return null;
                const isActive = cat.name === activeRail;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    aria-label={cat.title}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                      isActive && "bg-gray-100"
                    )}
                    onMouseEnter={() => setActiveRail(cat.name)}
                    onFocus={() => setActiveRail(cat.name)}
                    onClick={() => setActiveRail(cat.name)}
                  >
                    <span className="truncate">{cat.shortName || cat.title}</span>
                    <VscChevronRight className="text-gray-500" />
                  </button>
                );
              })}
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto px-8 py-8">
                <div className="
                  grid
                  w-full
                  gap-x-10 gap-y-8
                  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                ">
                  {currentCategory.children
                    .filter((child) => child.count > 0)
                    .map((child) => (
                      <div
                        key={child.name}
                        className="flex flex-col gap-3 min-w-0"
                      >
                        <Link
                          to={`/collection/${child.name}`}
                          className="text-[15px] font-semibold text-gray-900 hover:text-gray-700"
                          onClick={setClose}
                        >
                          {child.label} ({child.count})
                        </Link>
                        <div className="space-y-2">
                          {child.children
                            .filter((subChild) => subChild.count > 0)
                            .map((subChild) => (
                              <Link
                                key={subChild.name}
                                to={`/collection/${subChild.name}`}
                                className="block text-[13px] text-gray-700 hover:text-gray-900 leading-[18px]"
                                onClick={setClose}
                              >
                                {subChild.label} ({subChild.count})
                              </Link>
                            ))
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <Link
                to={`/collection/${currentCategory.name}`}
                className="flex items-center justify-between border-t border-gray-200 px-8 py-5 text-sm font-semibold text-gray-800 hover:text-gray-900"
                onClick={setClose}
              >
                <span>
                  Shop all {currentCategory.shortName || currentCategory.title} ({currentCategory.count})
                </span>
                <VscArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MegaMenu;
