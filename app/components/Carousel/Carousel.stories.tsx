import type { ComponentStory, ComponentMeta } from '@storybook/react';

import PicsCarousel from './index';

export default {
	title: 'Pics Carousel',
	component: PicsCarousel,
} as ComponentMeta<typeof PicsCarousel>

const images = [
	"https://cdn.shopify.com/s/files/1/0617/2498/3534/products/0e543f3c-e82a-4f92-b939-e8907f7e.png?v=1658482558",
	"https://cdn.shopify.com/s/files/1/0617/2498/3534/products/O1CN01qZcmyl1FyEZn9KoyS_22132903.jpg?v=1658482558",
	"https://cdn.shopify.com/s/files/1/0617/2498/3534/products/O1CN01XW3uH11FyEZsb3maE_22132903.jpg?v=1658482558",
	"https://cdn.shopify.com/s/files/1/0617/2498/3534/products/O1CN01mpKPnF1FyEZvUN2qE_22132903.jpg?v=1658482558",
	"https://cdn.shopify.com/s/files/1/0617/2498/3534/products/61gqxPkPlPL._AC_SL1001.jpg?v=1658482558",
];

const Template: ComponentStory<typeof PicsCarousel> = (args) => (
	<PicsCarousel {...args} />
);

export const ProductDetailCarousel = Template.bind({});
ProductDetailCarousel.args = {
	images: images,
};

