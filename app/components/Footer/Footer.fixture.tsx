import type { Category } from '~/shared/types';

import Footer from './index';

const categories: Category[] = [
  {
    catId: 3,
    title: 'Super Deal',
    name: 'super_deal',
  },

  {
    catId: 4,
    title: 'Clothes Accessories',
    name: 'cloths_accessories',
  },

  {
    catId: 5,
    title: 'Adult',
    name: 'adult',
  },

  {
    catId: 6,
    title: 'Car Accessories',
    name: 'car_accessories',
  },

  {
    catId: 7,
    title: 'Kitchen & Kitchenware',
    name: 'kitchen_kitchenware',
  },
]
export default (<Footer categories={categories} />)