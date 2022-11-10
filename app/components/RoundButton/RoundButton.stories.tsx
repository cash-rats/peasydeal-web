import type { ComponentMeta } from '@storybook/react';

import RoundButton from './index';

export default {
  title: 'RoundButton',
  component: RoundButton,
} as ComponentMeta<typeof RoundButton>;

export const AddToCart = () => (
  <RoundButton
    colorScheme='addtocart'
    onClick={() => console.log('hello')}
  >
    Add To Cart
  </RoundButton>
)

export const BuyNow = () => (
  <RoundButton
    colorScheme='buynow'
    onClick={() => console.log('hello')}
  >
    Buy Now
  </RoundButton>
)

export const View = () => (
  <RoundButton
    colorScheme='cerise'
    onClick={() => console.log('hello')}
  >
    View
  </RoundButton>
)