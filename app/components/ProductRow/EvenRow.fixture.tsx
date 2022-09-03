import EvenRow from "./EvenRow";
import type { Product } from "~/shared/lib/types";

const products: Array<Product> = [
	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
		productID: 'someid',
		currency: 'TWD',
		discount: 999,
		shortDescription: 'New deal today',
		retailPrice: 1999,
		salePrice: 1000,
		subtitle: 'New deal today',
		variationID: 'somevariationid'
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
		productID: 'someid',
		currency: 'TWD',
		discount: 999,
		shortDescription: 'New deal today',
		retailPrice: 1999,
		salePrice: 1000,
		subtitle: 'New deal today',
		variationID: 'somevariationid'
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
		productID: 'someid',
		currency: 'TWD',
		discount: 999,
		shortDescription: 'New deal today',
		retailPrice: 1999,
		salePrice: 1000,
		subtitle: 'New deal today',
		variationID: 'somevariationid'
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
		productID: 'someid',
		currency: 'TWD',
		discount: 999,
		shortDescription: 'New deal today',
		retailPrice: 1999,
		salePrice: 1000,
		subtitle: 'New deal today',
		variationID: 'somevariationid'
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
		productID: 'someid',
		currency: 'TWD',
		discount: 999,
		shortDescription: 'New deal today',
		retailPrice: 1999,
		salePrice: 1000,
		subtitle: 'New deal today',
		variationID: 'somevariationid'
	},

	{
		main_pic: 'https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg',
		title: 'Pop Up Gazebo - Cheap!',
		description: 'New deal today',
		productID: 'someid',
		currency: 'TWD',
		discount: 999,
		shortDescription: 'New deal today',
		retailPrice: 1999,
		salePrice: 1000,
		subtitle: 'New deal today',
		variationID: 'somevariationid'
	},
]

export default () => <EvenRow products={products} />;
