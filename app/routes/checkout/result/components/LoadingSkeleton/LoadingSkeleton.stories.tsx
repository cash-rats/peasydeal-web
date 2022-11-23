import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Comp from '.';

export default {
  title: 'Checkout Result',
  component: Comp,
} as ComponentMeta<typeof Comp>;

export const LoadingSkeleton = () => (<Comp />);

