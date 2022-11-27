import type { ComponentStory, ComponentMeta } from '@storybook/react';

import PageTitle from '.';

export default {
  title: 'Page Title',
  component: PageTitle,
} as ComponentMeta<typeof PageTitle>;

export const Basic = () => <PageTitle title="appliance" />;