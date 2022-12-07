import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ActivityGrid from './ActivityGrid';

export default {
  title: 'Activity Grid',
  component: ActivityGrid,
} as ComponentMeta<typeof ActivityGrid>;

export const Basic = () => (
  <ActivityGrid
    src='https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg'
  />
)