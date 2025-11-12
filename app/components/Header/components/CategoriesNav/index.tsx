import {
  useCallback,
  useEffect,
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
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [activeMenuName, setActiveMenuName] = useState<string | null>(null);

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
                <DropdownMenu open={isOpen} onOpenChange={(open) => (open ? setOpen() : setClose())}>
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
                      onMouseEnter={setOpen}
                      onMouseLeave={setClose}
                      onTouchEnd={e => {
                        e.preventDefault();
                        isOpen ? setClose() : setOpen();
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">ALL</span>
                        {isOpen ? <VscChevronUp className="text-lg" /> : <VscChevronDown className="text-lg" />}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    modal={false}
                    align="start"
                    sideOffset={12}
                    className="
                      mega-menu-content
                      flex w-[100vw] max-w-screen-xl border-none bg-white
                      shadow-[2px_4px_16px_rgb(0,0,0,0.08)]
                      pt-4 pb-8 xl:py-8 px-4
                    "
                    onMouseEnter={setOpen}
                    onMouseLeave={setClose}
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
