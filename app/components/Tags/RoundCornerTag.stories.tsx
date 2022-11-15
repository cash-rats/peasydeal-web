import type { ComponentStory, ComponentMeta } from '@storybook/react';

import RoundCorner from './RoundCornerTag';

export default {
  title: 'Tags',
  component: RoundCorner,
} as ComponentMeta<typeof RoundCorner>;

export const RoundCornerTag = () => <RoundCorner text="63 bought" />;