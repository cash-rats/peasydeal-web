import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Pennant from './Pennant';

export default {
  title: 'Price Tags',
  component: Pennant,
} as ComponentMeta<typeof Pennant>;

export const PennantTag = () => (<Pennant text1='price off' text2='20%' />);