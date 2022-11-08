import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MobileSearchDialog from './index';
import type { SuggestItem } from './index';

export default {
  title: 'Mobile Search Dialog',
  component: MobileSearchDialog,
} as ComponentMeta<typeof MobileSearchDialog>;

const Template = ({ open, items }) => {

  return (
    <MobileSearchDialog
      open={open}
      items={items}
    />
  )
}

export const Basic = Template.bind({});
Basic.args = {
  open: true,
  items: [
    {
      title: 'Item A',
      data: {
        title: 'Item A',
        productID: 'A',
      }
    },

    {
      title: 'Item B',
      data: {
        title: 'Item B',
        productID: 'B',
      }
    },
  ],
} as { open: boolean, items: SuggestItem[] };
