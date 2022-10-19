import type { ComponentMeta } from '@storybook/react';

import LoadMoreButton from './index';

export default {
  title: 'LoadMoreButton',
  component: LoadMoreButton,
} as ComponentMeta<typeof LoadMoreButton>;

export const basic = () => <LoadMoreButton />