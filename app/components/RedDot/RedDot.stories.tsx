import type { ComponentStory, ComponentMeta } from '@storybook/react';

import RedDot from './index';

export default {
	title: 'RedDot',
	component: RedDot,
} as ComponentMeta<typeof RedDot>

const Template: ComponentStory<typeof RedDot> = (args) => (
	<RedDot {...args} />
);

export const NormalRedDot = Template.bind({});
NormalRedDot.args = {
	value: 1000,
};

