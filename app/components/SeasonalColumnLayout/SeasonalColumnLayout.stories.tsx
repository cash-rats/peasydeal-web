import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SeasonalColumnLayout from './SeasonalColumnLayout';

export default {
  title: 'Activity Layout',
  component: SeasonalColumnLayout,
} as ComponentMeta<typeof SeasonalColumnLayout>;


const Template: ComponentStory<typeof SeasonalColumnLayout> = (args) => {
  return (
    <SeasonalColumnLayout activities={args.activities} />
  )
}

export const Basic = () => Template.bind({});
Basic.args = {
  activities: [
    {
      src: 'https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg',
      catID: 1,
      title: 'some activity'
    },
    {
      src: 'https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg',
      catID: 1,
      title: 'some activity'
    },
    {
      src: 'https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg',
      catID: 1,
      title: 'some activity'
    },
    {
      src: 'https://static.wowcher.co.uk/binaries/DS%20Outlet%20Tile%20Mobile.jpg',
      catID: 1,
      title: 'some activity'
    }
  ]
};

