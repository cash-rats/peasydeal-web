import styled from "styled-components";

import { ranges } from "~/styles/breakpoints";
import { OneMainTwoSubs, EvenRow } from "~/components/ProductRow";
import type { Product } from "~/components/ProductRow";

// We need to resize container based on viewport.
const Container = styled.div`
	padding-top: 20px;
	width: 100%;
	display: flex;
	justify-content: center;

	& > div {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		justify: center;

		@media ${ranges.desktopUp} {
			width: 1100px;
		}

		@media ${ranges.normalScreen} {
			width: 992px;
		}
	}
`;

const ProductRow = styled.div`
	padding-top: 20px;
	width: 100%;
`

// TODO: example data
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

/*
 * Product list page.
 *
 * - [ ] 根據 row index 的不同，顯示的 grid layout 會不一樣
 *    - 每 3 個 row OneMainTwoSubs 就會 reverse 一次
 *    - 頭一個 row 是 OneMainTwoSubs Layout
 *
 */
export default function Index() {
	return (
		<Container>
			<div>
				{/* display product lists */}
				<ProductRow>
					<OneMainTwoSubs products={products}/>
				</ProductRow>

				<ProductRow>
					<EvenRow products={products.slice(3)} />
				</ProductRow>
			</div>
		</Container>
	);
}
