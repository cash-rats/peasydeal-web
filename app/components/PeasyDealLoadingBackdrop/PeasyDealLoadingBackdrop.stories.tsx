import type { ComponentMeta } from '@storybook/react';

import LoadingBackdrop from './index';

export default {
  title: 'Loading Backdrop',
  component: LoadingBackdrop,
} as ComponentMeta<typeof LoadingBackdrop>;

export const Basic = () => (
  <LoadingBackdrop open />
);