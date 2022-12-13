import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ActivityBannerLayout from '.';

export default {
  title: 'Activity Banner Layout ',
  component: ActivityBannerLayout,
} as ComponentMeta<typeof ActivityBannerLayout>;



export const Basic = () => {
  return (
    <ActivityBannerLayout
      activityInfo={{
        title: 'Activity Title',
        catID: 1,
        catTitle: 'Activity Category',
      }}
      activityProds={[
        {
          title: 'prodA',
          url: 'https://images.wowcher.co.uk/images/deal/24986270/777x520/954622.jpg',
        },
        {
          title: 'prodB',
          url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
        },
        {

          title: 'prodC',
          url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
        },
        {
          title: 'prodD',
          url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
        },
        {
          title: 'prodE',
          url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
        },
        {
          title: 'prodF',
          url: 'https://images.wowcher.co.uk/images/deal/26206010/777x520/1011100.jpg',
        },
      ]} />
  )
}