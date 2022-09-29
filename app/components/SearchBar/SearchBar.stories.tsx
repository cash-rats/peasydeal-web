import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SearchBar from './index';

export default {
  title: 'search bar',
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>

const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar />
);

export const NormalSearchBar = Template.bind({});
NormalSearchBar.args = {
  value: 1000,
};

