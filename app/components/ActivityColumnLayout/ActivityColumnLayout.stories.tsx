import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ActivityLayout from './ActivityColumnLayout';

export default {
  title: 'Activity Layout',
  component: ActivityLayout,
} as ComponentMeta<typeof ActivityLayout>;


const Template: ComponentStory<typeof ActivityLayout> = (args) => {
  return (
    <ActivityLayout activities={args.activities} />
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

