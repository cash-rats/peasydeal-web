import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type WheelEvent,
} from "react";
import {
  Link,
} from 'react-router';
import { VscFlame, VscChevronRight, VscArrowRight, VscChevronLeft } from "react-icons/vsc";

import type { Category } from '~/shared/types';
import { cn } from '~/lib/utils';

import MegaMenu from './MegaMenu';

interface CategoriesNavProps {
  categories?: Array<Category>,
  topCategories?: Array<Category>,
};

export default function CategoriesNav({ categories = [], topCategories = [] }: CategoriesNavProps) {
  const [activeMenuName, setActiveMenuName] = useState<string | null>(null);
  const [activeRail, setActiveRail] = useState<string | null>(null);

  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = navScrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [categories, topCategories, updateScrollState]);

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
  };

  const closeMenuFor = (name: string) => {
    clearHoverTimeouts();
    setMenuDisplayed(false, name);
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

  const scrollNav = (direction: 'left' | 'right') => {
    const el = navScrollRef.current;
    if (!el) return;
    const distance = Math.max(el.clientWidth * 0.6, 200);
    const delta = direction === 'left' ? -distance : distance;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleWheelScroll = useCallback((event: WheelEvent<HTMLDivElement>) => {
    const el = navScrollRef.current;
    if (!el) return;

    const primaryDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    if (primaryDelta === 0) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const canScroll = (primaryDelta < 0 && el.scrollLeft > 0) || (primaryDelta > 0 && el.scrollLeft < maxScrollLeft);

    event.preventDefault();
    event.stopPropagation();

    if (!canScroll) return;

    const nextScroll = Math.min(Math.max(el.scrollLeft + primaryDelta, 0), maxScrollLeft);
    const delta = nextScroll - el.scrollLeft;

    if (delta !== 0) {
      el.scrollBy({ left: delta, behavior: 'auto' });
    }
  }, []);

  const showMegaMenuPanel = !!activeMenuName;
  const activeRailCategory = activeRail
    ? (
      topCategories.find(({ name }) => name === activeRail) ||
      categories.find(({ name }) => name === activeRail)
    )
    : null;

  const currentCategory =
    activeRailCategory ||
    topCategories.find(({ name }) => name === activeMenuName) ||
    categories.find(({ name }) => name === activeMenuName) ||
    null;

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
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll categories left"
            className="
              absolute left-0 top-0 bottom-0
              z-10
              flex items-center
              bg-gradient-to-r from-white via-white/85 to-transparent
              pl-2 pr-3
            "
            onClick={() => scrollNav('left')}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 text-gray-700 hover:text-gray-900 transition">
              <VscChevronLeft className="text-2xl" />
            </span>
          </button>
        )}

        <nav
          ref={navScrollRef}
          onWheel={handleWheelScroll}
          className="flex-auto relative overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-contain"
        >
          <ul id="mega-nav-bar" className={`
            relative
            flex flex-auto
            list-none
            space-x-1
            md:space-x-1.5
            xl:space-x-2
            align-center
            justify-start
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
                      px-0.5
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

        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll categories right"
            className="
              absolute right-0 top-0 bottom-0
              z-10
              flex items-center
              bg-gradient-to-l from-white via-white/85 to-transparent
              pl-3 pr-2
            "
            onClick={() => scrollNav('right')}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 text-gray-700 hover:text-gray-900 transition">
              <VscChevronRight className="text-2xl" />
            </span>
          </button>
        )}
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
              {categories.map((cat) => {
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
                        className="flex flex-col gap-3 min-w-0 rounded-lg px-3 py-2 transition hover:bg-gray-50 hover:shadow-sm hover:ring-1 hover:ring-gray-200 hover:-translate-y-0.5"
                      >
                        <Link
                          to={`/collection/${child.name}`}
                          className="text-base md:text-[17px] font-semibold text-gray-900 hover:text-gray-700"
                          onClick={() => closeMenuFor(activeMenuName || '')}
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
                                className="block text-sm md:text-[15px] text-gray-700 hover:text-gray-900 leading-[18px] rounded-full px-2.5 py-1 transition hover:bg-gray-100"
                                onClick={() => closeMenuFor(activeMenuName || '')}
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
                onClick={() => closeMenuFor(activeMenuName || '')}
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
