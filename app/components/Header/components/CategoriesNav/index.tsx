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
    <div className="categories-nav-container">
      <div className="CategoriesNav__scrollable-nav">
        {/* categories nav */}
        <nav className="featured-category-nav">
          <ul>
            {
              categories.map((category) => (
                <Link
                  key={category.catId}
                  // prefetch="intent"
                  to={`/${category.title}`}
                >
                  <li className="CategoriesNav__item" >
                    {category.title}
                  </li>
                </Link>
              ))
            }
          </ul>
        </nav>
      </div>

      <div
        className="Header__CategoriesNav__more"
        onMouseEnter={toggleOpenAllCategory}
        onMouseLeave={toggleOpenAllCategory}
      >
        <span className="Header__CategoriesNav__text">
          More
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
                        prefetch='intent'
                        to={`/${category.title}`}
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
