import type { ComponentMeta } from '@storybook/react';

import LoadMoreButton from './index';

export default {
  title: 'LoadMoreButton',
  component: LoadMoreButton,
} as ComponentMeta<typeof LoadMoreButton>;

export const basic = () => <LoadMoreButton text='Load more' />

export const disabled = () => <LoadMoreButton disabled text='Load more' />