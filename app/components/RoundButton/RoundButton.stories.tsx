import type { ComponentMeta } from '@storybook/react';

import RoundButton from './index';

export default {
  title: 'RoundButton',
  component: RoundButton,
} as ComponentMeta<typeof RoundButton>;

export const AddToCart = () => (
  <RoundButton
    colorScheme='addtocart'
    text='Add To Cart'
    onClick={() => console.log('hello')}
  />
)

export const BuyNow = () => (
  <RoundButton
    colorScheme='buynow'
    text='Buy Now'
    onClick={() => console.log('hello')}
  />
)

export const View = () => (
  <RoundButton
    colorScheme='blue'
    text='View'
    onClick={() => console.log('hello')}
  />
)