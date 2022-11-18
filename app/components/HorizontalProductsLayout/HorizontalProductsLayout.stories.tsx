import type { ComponentStory, ComponentMeta } from '@storybook/react';

import HorizontalProductsLayout from './HorizontalProductsLayout';
import HorizontalGrid from './HorizontalGrid';

export default {
  title: 'Horizontal Products Layout',
  component: HorizontalProductsLayout,
} as ComponentMeta<typeof HorizontalProductsLayout>;

export const HorizontalLayout = () => <HorizontalProductsLayout />

export const Grid = () => <HorizontalGrid />