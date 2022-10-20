import { useState } from "react";
import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";
import clsx from 'clsx';

import ScrollButton, { links as ScrollButtonLinks } from '~/components/ScrollButton';
import type { Category } from '~/shared/types';

import styles from './styles/CategoriesNav.css';

export const links: LinksFunction = () => {
  return [
    ...ScrollButtonLinks(),
    { rel: 'stylesheet', href: styles },
  ];
}
interface CategoriesNavProps {
  categories?: Array<Category>,
};

/*
 * - [x] Hover over all category should display all category list.
 * - [ ] If we have too many categories, we should have a scroll view.
 */
export default function CategoriesNav({ categories = [] }: CategoriesNavProps) {
  const [openAllCategories, setOpenAllCategories] = useState<boolean>(false);
  const toggleOpenAllCategory = (evt: MouseEvent<HTMLLIElement>) => {
    setOpenAllCategories(prev => !prev);
    evt.stopPropagation();
  }

  return (
    <div className="categories-nav-container">
      <div className="CategoriesNav__scrollable-nav">
        <div className="CategoriesNav__left-arrow">
          <ScrollButton
            direction="left"
            arrowWrapperStyle={{
              width: '1.6rem',
              height: '1.6rem',
              backgroundColor: '#fff',
            }}
            arrowStyle={{
              top: '35%',
              left: '45%',
              width: '0.5rem',
              height: '0.5rem',
              borderColor: 'rgb(52, 52, 52)',
            }}
          />
        </div>

        {/* categories nav */}
        <nav className="featured-category-nav">
          <ul>
            {
              categories.map((category) => (
                <li className="CategoriesNav__item" key={category.catId}>
                  <Link to={`${category.url}`}>
                    {category.title}
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>

        <div className="CategoriesNav__right-arrow">
          <ScrollButton
            direction="right"
            arrowWrapperStyle={{
              width: '1.6rem',
              height: '1.6rem',
              backgroundColor: '#fff',
            }}
            arrowStyle={{
              top: '35%',
              left: '29%',
              width: '0.5rem',
              height: '0.5rem',
              borderColor: 'rgb(52, 52, 52)',
            }}
          />
        </div>
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
                categories.map((category, index) => {
                  return (
                    <div key={index} className="Header__CategoriesNav__all-cats-title">
                      <Link to={`/${category.title}`}>
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
