import type { ComponentMeta } from '@storybook/react';

import CssSpinner from './index';

export default {
  title: 'Css Spinner',
  component: CssSpinner,
} as ComponentMeta<typeof CssSpinner>

export const Circle = () => (
  <CssSpinner />
)

export const Spinner = () => (
  <CssSpinner scheme='spinner' />
)

export const Default = () => (
  <CssSpinner scheme='default' />
)