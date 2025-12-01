import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
} from 'react-router';
import { VscFlame, VscChevronRight, VscArrowRight } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import MegaMenu from './MegaMenu';
import { cn } from '~/lib/utils';

interface CategoriesNavProps {
  categories?: Array<Category>,
  topCategories?: Array<Category>,
};

export default function CategoriesNav({ categories = [], topCategories = [] }: CategoriesNavProps) {
  console.log('~ CategoriesNav 1', categories);
  console.log('~ CategoriesNav 2', topCategories);

  const ALL_CATEGORIES = 'ALL';
  const [activeMenuName, setActiveMenuName] = useState<string | null>(null);
  const [activeRail, setActiveRail] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [navBounds, setNavBounds] = useState<{ bottom: number } | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setNavBounds({ bottom: rect.bottom });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, []);

  useEffect(() => {
    if (activeMenuName !== ALL_CATEGORIES) {
      setIsOpen(false);
    }
  }, [activeMenuName]);

  const clearHoverTimeouts = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const setMenuDisplayed = useCallback((show: boolean, name: string) => {
    if (show) {
      setActiveMenuName(name);
      setActiveRail(name);
      return;
    }
    setActiveMenuName((prev) => (prev === name ? null : prev));
    setActiveRail((prev) => (prev === name ? null : prev));
  }, []);

  const openMenuFor = (name: string) => {
    clearHoverTimeouts();
    setMenuDisplayed(true, name);
    if (name === ALL_CATEGORIES) {
      setIsOpen(true);
    }
  };

  const closeMenuFor = (name: string) => {
    clearHoverTimeouts();
    setMenuDisplayed(false, name);
    if (name === ALL_CATEGORIES) {
      setIsOpen(false);
    }
  };

  const setDelayedOpenFor = (name: string) => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    openTimeoutRef.current = setTimeout(() => openMenuFor(name), 300);
  };

  const setDelayedCloseFor = (name: string) => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => closeMenuFor(name), 150);
  };

  const openMenu = () => {
    openMenuFor(ALL_CATEGORIES);
  };

  const closeMenu = () => {
    closeMenuFor(ALL_CATEGORIES);
  };

  const setDelayedOpen = () => {
    setDelayedOpenFor(ALL_CATEGORIES);
  };

  const setDelayedClose = () => {
    setDelayedCloseFor(ALL_CATEGORIES);
  };

  const setClose = () => closeMenu();

  const showMegaMenuPanel = !!(activeMenuName && activeMenuName !== ALL_CATEGORIES);
  const activeRailCategory = activeRail
    ? topCategories.find(({ name }) => name === activeRail)
    : null;
  const currentCategory =
    activeRailCategory ||
    topCategories.find(({ name }) => name === activeMenuName) ||
    categories.find(({ name }) => name === activeMenuName) ||
    null;

  const MegaMenuListItem = ({ className, children }: { className?: string; children: ReactNode }) => (
    <div className={cn('flex items-center rounded px-2 py-1 text-base hover:bg-gray-100', className)}>
      {children}
    </div>
  );

  return (
    <div
      className={`
        hidden md:flex
        flex-col justify-center items-center
        max-w-screen-xl w-full
        mx-1 md:mx-4 my-auto
        relative
      `}
      ref={navRef}
    >
      <div className="flex relative items-center flex-auto w-full">
        <nav className="flex-auto relative overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul id="mega-nav-bar" className={`
            relative
            flex flex-auto
            list-none
            space-x-1
            md:space-x-2
            xl:space-x-4
            align-center
            justify-between
            p-0 m-0`}>
            {
              categories.map((category, index) => {
                const categoryUrl = category.type === 'promotion'
                  ? `/promotion/${category.name}`
                  : `/collection/${category.name}`;

                return index === 0 ? (
                  <li
                    key={`${index}_menu_link`}
                    className={`
                      flex-none
                      cursor-pointer
                      flex-auto
                      self-center
                      transition
                      nowrap
                      px-1 lg:px-2 xl:px-2
                      py-2 md:py-2 lg:py-4
                      bg-[#EA4335] text-white items-center font-semibold flex flex-row
                    `}
                  >
                    <Link
                      to={categoryUrl}
                      className="
                        flex-auto
                        flex flex-row
                        items-center
                        nowrap
                        text-center lg:text-left xl:text-center
                        text-xs md:text-sm xl:text-base
                      "
                    >
                      <VscFlame className="mr-1" />
                      <span>{category.shortName || category.title}</span>
                    </Link>
                  </li>
                ) : (
                  <li
                    key={`${index}_menu_link`}
                    className="
                      flex-none
                      self-center
                      bg-gradient-to-r from-[#D02E7D] to-[#D02E7D]
                      bg-no-repeat bg-[length:0%_1px] hover:bg-[length:100%_2px]
                      bg-[position:0_calc(100%-0px)]
                      transition-[background-size] duration-200
                    "
                  >
                    {/* Category item list */}
                    <MegaMenu
                      category={category}
                      activeMenuName={activeMenuName}
                      onOpen={openMenuFor}
                      onClose={closeMenuFor}
                      onDelayedOpen={setDelayedOpenFor}
                      onDelayedClose={setDelayedCloseFor}
                    />
                  </li>
                );
              })
            }
          </ul>
        </nav>
      </div>

      {showMegaMenuPanel && currentCategory && (
        <div
          className="
            absolute
            left-0
            top-full
            w-full
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
          onMouseEnter={() => activeMenuName && openMenuFor(activeMenuName)}
          onMouseLeave={() => activeMenuName && setDelayedCloseFor(activeMenuName)}
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
                          onClick={() => closeMenuFor(activeMenuName || ALL_CATEGORIES)}
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
                                onClick={() => closeMenuFor(activeMenuName || ALL_CATEGORIES)}
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
                onClick={() => closeMenuFor(activeMenuName || ALL_CATEGORIES)}
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
  );
}
