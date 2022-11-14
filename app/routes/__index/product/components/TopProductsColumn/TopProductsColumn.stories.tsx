import type { ComponentStory, ComponentMeta } from '@storybook/react';

import TopProductsColumn from './index';

export default {
  title: 'Top Products Column',
  component: TopProductsColumn,
} as ComponentMeta<typeof TopProductsColumn>;

export const Basic = () => (<TopProductsColumn />);