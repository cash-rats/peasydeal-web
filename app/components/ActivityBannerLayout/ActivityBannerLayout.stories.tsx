import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ActivityBannerLayout from '.';

export default {
  title: 'Activity Banner Layout ',
  component: ActivityBannerLayout,
} as ComponentMeta<typeof ActivityBannerLayout>;



export const Basic = () => {
  return (
    <ActivityBannerLayout activityProds={[
      {
        url: 'https://images.wowcher.co.uk/images/deal/24986270/777x520/954622.jpg',
      },
      {
        url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
      },
      {
        url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
      },
      {
        url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
      },
      {
        url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
      },
      {
        url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
      },
    ]} />
  )
}