import { useState } from 'react';
import type { ComponentMeta } from '@storybook/react';

import DropDownSearchBar from './index';

export default {
  title: 'DropDownSearchBar',
  component: DropDownSearchBar,
} as ComponentMeta<typeof DropDownSearchBar>;

const mockedResults = ['PS5', 'towel', 'toy', 'ps4'];

const mockAPIResult = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockedResults);
    }, 1500);
  });
}

const Template = ({ results }) => {
  const [sResults, setResults] = useState(results);
  const handleDropDownSearch = async () => {
    setResults(await mockAPIResult());
  }

  return (
    <DropDownSearchBar
      results={sResults}
      onDropdownSearch={handleDropDownSearch}
    />
  )
}

export const Basic = Template.bind({});

Basic.args = {
  results: [],
};