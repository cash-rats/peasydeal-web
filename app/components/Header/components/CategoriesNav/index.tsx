import { useEffect, useState } from "react";
import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { VscFlame } from "react-icons/vsc";
import clsx from 'clsx';

import type { Category } from '~/shared/types';

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

const topCategories = [
  'hot_deal',
  'new_trend',
  'electronic',
  'clothes_shoes',
  'home_appliances',
  'kitchen_kitchenware',
  'toy',
  'pet',
  'car_accessories',
];

/*
 * - [x] Hover over all category should display all category list.
 * - [ ] If we have too many categories, we should have a scroll view.
 * - [ ]
 */
export default function CategoriesNav({ categories = [], topCategories = [] }: CategoriesNavProps) {
  const [openAllCategories, setOpenAllCategories] = useState<boolean>(false);

  const toggleOpenAllCategory = (evt: MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    setOpenAllCategories(prev => !prev);
  }

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
            <li
              className="Header__CategoriesNav__more flex justify-center items-center relative cursor-pointer"
              onClick={toggleOpenAllCategory}
              onMouseEnter={toggleOpenAllCategory}
              onMouseLeave={toggleOpenAllCategory}
            >
              <span className={`
                text-sm lg:text-base
                px-0 lg:px-2
                py-2 md:py-4
                flex flex-row
              `}>
                <span>ALL</span>
                <div className="Header__CategoriesNav__arrow_wrapper">
                  <div className={clsx("Header__CategoriesNav__arrow-up", {
                    "Header__CategoriesNav__arrow-down": openAllCategories,
                  })} />
                </div>
              </span>

              {
                openAllCategories && (
                  <div className="Header__CategoriesNav__all-cats">
                    {
                      categories.map((category) => {
                        return (
                          <div key={category.catId} className="Header__CategoriesNav__all-cats-title">
                            <Link
                              // prefetch='intent'
                              state={{ scrollToTop: true }}
                              to={`/${category.name}`}
                            >
                              <span className="Header__CategoriesNav__all-cats-title-text fromLeft">
                                {category.title}
                              </span>
                            </Link>
                          </div>
                        );
                      })
                    }
                  </div>
                )
              }
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
