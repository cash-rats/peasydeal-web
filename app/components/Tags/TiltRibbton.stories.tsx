import type { ComponentStory, ComponentMeta } from '@storybook/react';

import TiltRibbon from './TiltRibbon';

export default {
  title: 'Price Tags',
  component: TiltRibbon,
} as ComponentMeta<typeof TiltRibbon>;

export const TiltRibbonTag = () => (
  <div style={{
    position: 'relative',
    maxWidth: '600px',
    width: '90%',
    height: '400px',
    background: '#fff',
    boxShadow: '0 0 15px rgba(0, 0, 0, .1)',
  }}>
    <TiltRibbon text='new' />
  </div>
);