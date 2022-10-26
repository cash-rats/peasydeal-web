import { useState } from 'react';
import type { ComponentMeta } from '@storybook/react';

import QuantityPicker from './index';

export default {
  title: 'Quantity Picker ',
  component: QuantityPicker,
} as ComponentMeta<typeof QuantityPicker>

const Template = () => {
  const [v, setV] = useState(0);
  return (
    <div style={{
      width: '200px',
    }}>
      <QuantityPicker
        onChange={(evt) => { setV(Number(evt.target.value)) }}
        onDecrease={(cNum) => { setV(prev => prev - 1) }}
        onIncrease={(cNum) => { setV(prev => prev + 1) }}
        value={v}
      />
    </div>
  )
}

export const Basic = Template.bind({});
