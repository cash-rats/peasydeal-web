import type { Meta, StoryFn } from '@storybook/react';

import TextDropdownField from './index';

const story: Meta = {
  title: 'Text Dropdown Field',
  component: TextDropdownField,
  decorators: [
    (Story) => {
      return (
        <div>
          <Story />
        </div>
      )
    },
  ],
};

export default story;

const Template: StoryFn<typeof TextDropdownField> = (args) => {
  return (<TextDropdownField
    options={[
      {
        label: 'some address1',
        value: 'some address1',
      },
      {
        label: 'some address2',
        value: 'some address2',
      },

      {
        label: 'some address3',
        value: 'some address3',
      }
    ]}
    {...args}
  />)
};

export const Basic = Template.bind({
  id: 'address1',
  required: true,
  label: "address line 1",
  name: "address1",
  variant: "outlined",
  'aria-describedby': "address1",
  fullWidth: true,
  value: "some taiwanese address",
});