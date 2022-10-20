import { useState } from "react";
import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";
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
 */
export default function CategoriesNav({ categories = [] }: CategoriesNavProps) {
  const [openAllCategories, setOpenAllCategories] = useState<boolean>(false);
  const toggleOpenAllCategory = (evt: MouseEvent<HTMLLIElement>) => {
    setOpenAllCategories(prev => !prev);
    evt.stopPropagation();
  }

  return (
    <div className="categories-nav-container">

      {/* categories nav */}
      <nav className="featured-category-nav">
        <ul>
          {
            categories.map((category) => (
              <li className="CategoriesNav_item" key={category.catId}>
                <Link to={`${category.url}`}>
                  {category.title}
                </Link>
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
}
