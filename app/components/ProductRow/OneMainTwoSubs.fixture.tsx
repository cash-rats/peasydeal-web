import type { Product } from "~/shared/lib/types";

import OneMainTwoSubs from "./OneMainTwoSubs";

const products: Array<Product> = [
	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		shortDescription: 'New deal today',
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		shortDescription: 'New deal today',
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Beige, Black, Green, or Grey!',
		shortDescription: 'awesome deal',
	},
]
export default () => <OneMainTwoSubs products={products} />;
