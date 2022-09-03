import { Button } from "@chakra-ui/react";

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
	onClickProduct = () => {},
}: LargeGridProps) {
	return (
		<div className="large-grid-container">
			{/* image */}
			<div className="image-container">
				<img className="large-grid-image" src={image} />
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
	);
}

export default LargeGrid;
