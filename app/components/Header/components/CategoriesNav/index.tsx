import { useState } from "react";
import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
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
};

/*
 * - [x] Hover over all category should display all category list.
 * - [ ] If we have too many categories, we should have a scroll view.
 * - [ ]
 */
export default function CategoriesNav({ categories = [] }: CategoriesNavProps) {
  const [openAllCategories, setOpenAllCategories] = useState<boolean>(false);
  const toggleOpenAllCategory = (evt: MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    setOpenAllCategories(prev => !prev);
  }

  return (
    <div className={`
      flex flex-row justify-center items-center
      max-w-screen-xl w-full mx-auto my-auto relative py-2
      hidden
      md:flex
    `}>
      <div className="w-[88%] flex relative items-center">
        {/* categories nav */}
        <nav className="overflow-x-scroll m-0 flex flex-auto">
          <ul className={`
            flex
            list-none
            space-x-4
            align-center
            justify-between
            p-0 m-0`}>
            {
              categories.map((category) => (
                <Link
                  replace
                  key={category.catId}
                  state={{ scrollToTop: true }}
                  to={`/${category.name}`}
                >
                  <li className={`
                    transition ease-in-out
                    CategoriesNav__item
                    fromLeft
                    font-bold
                    py-2
                    cursor-pointer
                    flex-auto
                    text-base`}>
                    {category.title}
                  </li>
                </Link>
              ))
            }
          </ul>
        </nav>
      </div>

      <div
        className="Header__CategoriesNav__more flex justify-center items-center relative w-[12%] p-2"
        onMouseEnter={toggleOpenAllCategory}
        onMouseLeave={toggleOpenAllCategory}
      >
        <div className="border-left" />
        <span className="Header__CategoriesNav__text font-bold">
          all
        </span>

        <div className="Header__CategoriesNav__arrow_wrapper">
          <div className={clsx("Header__CategoriesNav__arrow-up", {
            "Header__CategoriesNav__arrow-down": openAllCategories,
          })} />
        </div>

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
      </div>
    </div>
  );
}
