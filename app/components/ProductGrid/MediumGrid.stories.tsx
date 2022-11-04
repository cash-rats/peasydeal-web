import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MediumGrid from './MediumGrid';
import MediumGridSkeleton from './MediumGridSkeleton';

export default {
  title: 'Meidum Product Grid',
  component: MediumGrid,
} as ComponentMeta<typeof MediumGrid>;

export const Basic = () => (
  <MediumGrid
    productID='someid'
    image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
    title='Personalised Moon Lamp - Photo & Text Options'
  />
)

export const Skeleton = () => (
  <MediumGridSkeleton />
);
