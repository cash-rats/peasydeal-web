import type { ComponentStory, ComponentMeta } from '@storybook/react';

import LargeGrid from './LargeGrid';
import LargeGridSkeleton from './LargeGridSkeleton';

export default {
  title: 'Large Product Grid',
  component: LargeGrid,
} as ComponentMeta<typeof LargeGrid>;

export const Basic = () => (
  <LargeGrid
    productID='someid'
    image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
    title='Personalised Moon Lamp - Photo & Text Options'
  />
);

export const TagComboA = () => (
  <LargeGrid
    tagCombo='combo_a'
    productID='someid'
    image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
    title='Personalised Moon Lamp - Photo & Text Options'
  />
);

export const TagComboB = () => (
  <LargeGrid
    tagCombo='combo_b'
    productID='someid'
    image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
    title='Personalised Moon Lamp - Photo & Text Options'
  />
);

export const TagComboC = () => (
  <LargeGrid
    tagCombo='combo_c'
    productID='someid'
    image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
    title='Personalised Moon Lamp - Photo & Text Options'
  />
);

export const TagComboD = () => (
  <LargeGrid
    tagCombo='combo_d'
    productID='someid'
    image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
    title='Personalised Moon Lamp - Photo & Text Options'
  />
);

export const Skeleton = () => (
  <LargeGridSkeleton />
);