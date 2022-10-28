import { useState } from 'react';
import type { ComponentMeta } from '@storybook/react';

import QuantityDropDown from './index';

export default {
  title: 'Quantity Dropdown',
  component: QuantityDropDown,
} as ComponentMeta<typeof QuantityDropDown>;

const Template = () => {
  const [num, setNum] = useState(2);
  const handleOnChange = (evt) => {
    setNum(Number(evt.target.value));
  }

  return (
    <div style={{
      width: '55px',
    }}>
      <QuantityDropDown
        value={num}
        onChange={handleOnChange}
      />
    </div>
  )
}

export const Basic = Template.bind({});