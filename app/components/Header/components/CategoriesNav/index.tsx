import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type LinksFunction,
  Link,
} from 'react-router';
import { VscFlame, VscChevronDown, VscChevronUp } from "react-icons/vsc";

import type { Category } from '~/shared/types';

import MegaMenu, { links as MegaMenuLink } from './MegaMenu';
import MegaMenuContent, { links as MegaMenuContentLink } from '../MegaMenuContent';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

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
  const [activeMenuName, setActiveMenuName] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const openMenu = () => {
    clearHoverTimeouts();
    setMenuDisplayed(true, ALL_CATEGORIES);
    setIsOpen(true);
  };

  const closeMenu = () => {
    clearHoverTimeouts();
    setMenuDisplayed(false, ALL_CATEGORIES);
    setIsOpen(false);
  };

  const setDelayedOpen = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    openTimeoutRef.current = setTimeout(openMenu, 200);
  };

  const setDelayedClose = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(closeMenu, 150);
  };

  const setOpen = () => openMenu();
  const setClose = () => closeMenu();

  const setMenuDisplayed = useCallback((_show: boolean, name: string) => {
    setActiveMenuName(name);
  }, []);

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
    >
      <div className="flex relative items-center flex-auto w-full">
        <nav className="flex-auto relative">
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
              topCategories.map((category, index) => {
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
                  <li key={`${index}_menu_link`} className="CategoriesNav__item fromLeft self-center">
                    <MegaMenu
                      category={category}
                      setMenuDisplayed={setMenuDisplayed}
                      activeMenuName={activeMenuName}
                    />
                  </li>
                );
              })
            }

            <li className="self-center ">
              <div className="mega-menu-wrapper">
                <DropdownMenu open={isOpen} onOpenChange={(open) => (open ? openMenu() : closeMenu())}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      aria-label="ALL"
                      className="
                        text-sm lg:text-base
                        px-0 lg:px-2
                        py-2 md:py-4
                        flex flex-col
                        items-center relative
                      "
                      onMouseEnter={setDelayedOpen}
                      onMouseLeave={setDelayedClose}
                      onTouchEnd={e => {
                        e.preventDefault();
                        isOpen ? closeMenu() : openMenu();
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">ALL</span>
                        {isOpen ? <VscChevronUp className="text-lg" /> : <VscChevronDown className="text-lg" />}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={12}
                    className="
                      mega-menu-content
                      flex w-[100vw] max-w-screen-xl border-none bg-white
                      shadow-[2px_4px_16px_rgb(0,0,0,0.08)]
                      pt-4 pb-8 xl:py-8 px-4
                      z-[9999]
                    "
                    onMouseEnter={openMenu}
                    onMouseLeave={setDelayedClose}
                  >
                    <MegaMenuContent
                      categories={categories}
                      onClose={setClose}
                      ItemNode={MegaMenuListItem}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}
