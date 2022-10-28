import { useState } from 'react';
import type { ComponentMeta } from '@storybook/react';

import QuantityDropDown from './index';

export default {
  title: 'Quantity Dropdown',
  component: QuantityDropDown,
} as ComponentMeta<typeof QuantityDropDown>;

const Template = () => {
  const [num] = useState(2);
  return (
    <div style={{
      width: '55px',
    }}>
      <QuantityDropDown
        value={num}
        onChange={(evt, number) => {
          console.log('onchange', number);
        }}
      />
    </div>
  )
}

export const Basic = Template.bind({});