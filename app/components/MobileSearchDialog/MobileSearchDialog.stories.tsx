import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MobileSearchDialog from './index';

export default {
  title: 'Mobile Search Dialog',
  component: MobileSearchDialog,
} as ComponentMeta<typeof MobileSearchDialog>;

const Template = ({ open }) => {

  return (
    <MobileSearchDialog
      open={open}
    />
  )
}

export const Basic = Template.bind({});
Basic.args = {
  open: true,
};
