import EvenRow from "./EvenRow";
import type { Product } from "./index";

const products: Array<Product> = [
	{
		image: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
	},

	{
		image: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		description: 'New deal today',
	},

	{
		image: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		description: 'awesome deal',
	},

	{
		image: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		description: 'New deal today',
	},

	{
		image: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		description: 'New deal today',
	},

	{
		image: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		description: 'New deal today',
	},
]

export default () => <EvenRow products={products} />;
