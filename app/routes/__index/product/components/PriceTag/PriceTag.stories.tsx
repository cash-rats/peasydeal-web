import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import PriceTag from './index';

export default {
  title: 'Price Tag',
  component: PriceTag,
} as ComponentMeta<typeof PriceTag>

export const Primary: ComponentStory<typeof PriceTag> = () => (
	<PriceTag
		moneySaved={100}
		percentOff={20}
	/>
);

