import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SunShine from './SunShine';

export default {
  title: 'Price Tags',
  component: SunShine,
} as ComponentMeta<typeof SunShine>;

export const Basic = () => <SunShine text='50% price off' />;