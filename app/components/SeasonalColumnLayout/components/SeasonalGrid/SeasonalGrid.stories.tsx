import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SeasonalGrid from './SeasonalGrid';

export default {
  title: 'Activity Grid',
  component: SeasonalGrid,
} as ComponentMeta<typeof SeasonalGrid>;

export const Basic = () => (
  <SeasonalGrid
    src='https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg'
  />
)