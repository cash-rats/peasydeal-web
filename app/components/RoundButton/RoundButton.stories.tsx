import type { ComponentMeta } from '@storybook/react';

import RoundButton from './index';

export default {
  title: 'RoundButton',
  component: RoundButton,
} as ComponentMeta<typeof RoundButton>;

export const addToCart = () => (
  <RoundButton
    colorScheme='addtocart'
    text='Add To Cart'
    onClick={() => console.log('hello')}
  />
)

export const buyNow = () => (
  <RoundButton
    colorScheme='buynow'
    text='Buy Now'
    onClick={() => console.log('hello')}
  />
)

export const view = () => (
  <RoundButton
    colorScheme='view'
    text='View'
    onClick={() => console.log('hello')}
  />
)