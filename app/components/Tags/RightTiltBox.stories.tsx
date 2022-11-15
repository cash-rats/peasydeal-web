import type { ComponentStory, ComponentMeta } from '@storybook/react';

import RightTilt from './RightTiltBox';

export default {
  title: 'Tags',
  component: RightTilt,
} as ComponentMeta<typeof RightTilt>;

export const RightTiltTag = () => <RightTilt text='63 bought' />;