import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import type { LinksFunction } from '@remix-run/node';

import MqNotifier from '~/components/MqNotifier';
import { breakPoints } from '~/styles/breakpoints';

import styles from "./styles/MediumGrid.css";


export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	]
}

interface MediumGridProps {
	productID: string;
	image: string;
	title: string;
	description: string;
	onClickProduct?: (productID: string) => void;
};

// - [ ] Basic product grid. do not consider wrapper layout.
// - [ ] breakpoint: > desktopUp, 1 row  has 3 columns
// - [ ] Image should be as large as the grid width
// - [ ] Do not display product description on medium grid
// -
//      > 0 && < 599 100%x380px, 1 grid
//      >= 600: 273px256px, 2 grid
//      > 1199: 353.33x306, 3 grids flex 1
//      > 767: 323x290, 2 grids flex 1
export default function MediumGrid({
	productID,
	image,
	title,
	description,
	onClickProduct = () => {},
}: MediumGridProps) {
	const [clickableGrid, setClickableGrid] = useState<boolean>(false);

	console.log('clickableGrid', clickableGrid);

	return (
		<MqNotifier
			mqValidators={[
				{
					condition: () => true,
					callback: (dom) => setClickableGrid(
						dom.innerWidth <= breakPoints.phoneTop
					),
				}
			]}
		>
			<div
				onClick={
					clickableGrid
						? () => onClickProduct(productID)
						: () => {}
				}
				className="medium-grid-container"
			>
				{/* images */}
				<div className="image-container">
					<img
						className="prod-main-image"
						src={image}
					/>
				</div>

				{/* Product Description */}
				<div className="product-desc-container">
					<div className="prod-info">
						{/* topic */}
						<div className="headline">
							{title}
						</div>

						<p>
							{description}
						</p>
					</div>

					<div className="view-btn-container">
						<Button colorScheme="blue" onClick={() => onClickProduct(productID)}>
							View
						</Button>
					</div>
				</div>
			</div>
		</MqNotifier>
	);
};
