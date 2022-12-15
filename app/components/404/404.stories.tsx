import type { Meta, StoryFn } from '@storybook/react';

import NotFound from './index';

const story: Meta<typeof NotFound> = {
  title: '404',
  component: NotFound,
};

export default story;

const Template = (args) => {
  return (<NotFound {...args} />)
};

export const Basic = Template.bind({});