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

export const Skeleton = () => (
  <LargeGridSkeleton />
);