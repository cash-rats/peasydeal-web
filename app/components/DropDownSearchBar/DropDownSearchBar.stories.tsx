import { useState } from 'react';
import type { ComponentMeta } from '@storybook/react';

import DropDownSearchBar from './index';

export default {
  title: 'DropDownSearchBar',
  component: DropDownSearchBar,
} as ComponentMeta<typeof DropDownSearchBar>;

const mockedResults = [{ title: 'PS5', data: {} }, { title: 'towel', data: {} }, { title: 'toy', data: {} }, { title: 'ps4', data: {} }];

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

const TemplateWithDropDown = ({ results }) => {
  return (
    <DropDownSearchBar results={results} />
  );
}

export const Basic = Template.bind({});

export const Dropdown = TemplateWithDropDown.bind({});

Basic.args = {
  results: [],
};

Dropdown.args = {
  results: [
    {
      title: 'i10 Touch Tws Earbuds - 5 colors',
      data: {
        discount: 0.3377,
        image: "https://cdn.shopify.com/s/files/1/0257/7327/7233/products/01_687e1a8a-e1be-4f26-836c-6834ec989be8.jpg?v=1603422713",
        title: "i10 Touch Tws Earbuds - 5 colors",
      },
    },
    {
      title: 'Little Book of Earrings Storage',
      data: {
        discount: 0.3366,
        image: "https://cdn.shopify.com/s/files/1/0257/7327/7233/products/9258e3_31ecabc1760d489689c928ede0abca06_mv2.png?v=1588066820",
        title: "Little Book of Earrings Storage",
      },
    },
    {
      title: 'iD012 TWS Wireless Bluetooth 4.2 Earbuds Control Earphone',
      data: {
        discount: 0.39,
        image: "https://cdn.shopify.com/s/files/1/0257/7327/7233/products/HTB1,FMUja8r0gK0jSZFnq6zRRXXaX.jpg?v=1611216771",
        title: "D012 TWS Wireless Bluetooth 4.2 Earbuds Control Earphone",
      },
    },
  ],
}