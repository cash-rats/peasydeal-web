import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Scratch from './Scratch';

export default {
  title: 'Tags',
  component: Scratch,
} as ComponentMeta<typeof Scratch>;

export const ScratchTag = () => (
  <Scratch />
);