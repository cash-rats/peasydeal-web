import { useState } from "react";
import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";

import styles from './styles/CategoriesNav.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
}

export type Category = {
  catId: number;
  title: string;
  name?: string;
};

interface CategoriesNavProps {
  categories?: Array<Category>,
};

/*
 * - [ ] Hover over all category should display all category list.
 * - [ ] If we have too many categories, we should have a scroll view.
 */
export default function CategoriesNav({ categories = [] }: CategoriesNavProps) {
  const [openAllCategories, setOpenAllCategories] = useState<boolean>(false);
  const toggleOpenAllCategory = (evt: MouseEvent<HTMLLabelElement>) => {
    setOpenAllCategories(prev => !prev);
    evt.stopPropagation();
  }

  return (
    <div className="categories-nav-container">
      <nav className="all-categories-nav">
        <label
          onClick={toggleOpenAllCategory}
          onMouseEnter={toggleOpenAllCategory}
          onMouseLeave={toggleOpenAllCategory}
        >
          <span>
            <BsList fontSize={24} color="#fff" />
            <span>
              All Categories
              {
                // TODO add animation
                openAllCategories
                  ? <RiArrowUpSLine />
                  : <RiArrowDownSLine />
              }
            </span>
          </span>

          {/* Submenu */}
          {
            openAllCategories
              ? (
                <ul className="all-category-list">
                  {
                    categories.map((category) => {
                      return (
                        <li
                          className="category-list-item"
                          key={category.catId}
                        >
                          <a>
                            {category.title}
                          </a>
                        </li>
                      );
                    })
                  }

                </ul>
              ) : ''
          }
        </label>
      </nav>

      {/* categories nav */}
      <nav className="featured-category-nav">
        <ul>
          {
            categories.map((category) => (
              <li key={category.catId}>
                <a>
                  {category.title}
                </a>
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
}
