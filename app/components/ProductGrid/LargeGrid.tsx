import { useState } from 'react';
import { Button } from "@chakra-ui/react";

import MqNotifier from '~/components/MqNotifier';
import { breakPoints } from '~/styles/breakpoints';

import styles from "./styles/LargeGrid.css";

export function links() {
	return [
		{ rel: "stylesheet", href: styles },
	];
}

interface LargeGridProps {
	productID: string;
	image: string;
	title: string;
	description: string;
	onClickProduct?: (productID: string) => void;
}


// > 1200, flex:2; height
function LargeGrid({
	productID,
	image,
	title,
	description,
	onClickProduct = () => { },
}: LargeGridProps) {
	const [clickableGrid, setClickableGrid] = useState<boolean>(false);

	return (
		<MqNotifier
			mqValidators={[
				{
					condition: () => true,
					callback: (dom) => setClickableGrid(
						dom.innerWidth <= breakPoints.phoneTop
					)
				},
			]}
		>
			<div
				className="large-grid-container"
				onClick={
					clickableGrid
						? () => onClickProduct(productID)
						: () => { }
				}
			>
				{/* image */}
				<div className="image-container">
					<img alt={title} className="large-grid-image" src={image} />
				</div>

				<div className="product-desc-container">
					<div className="info">
						<div className="headline">
							{title}
						</div>
						<div className="desc">
							{description}
						</div>
					</div>

					<div className="btn-container">
						<Button
							colorScheme="blue"
							size="lg"
							onClick={() => onClickProduct(productID)}
						>
							View
						</Button>
					</div>
				</div>
			</div>
		</MqNotifier>
	);
}

export default LargeGrid;
