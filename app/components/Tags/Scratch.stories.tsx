import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Scratch from './Scratch';

export default {
  title: 'Price Tags',
  component: Scratch,
} as ComponentMeta<typeof Scratch>;

export const ScratchTag = () => (
  <Scratch />
);