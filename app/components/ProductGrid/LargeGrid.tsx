import { useState } from 'react';
import { Link, useSubmit } from '@remix-run/react';

import RoundButton from '~/components/RoundButton';
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
			{
				clickableGrid
					? (
						<Link
							prefetch='intent'
							className="large-grid-container"
							to={`/product/${productID}`}
							onClick={() => onClickProduct(productID)
							}
						>
							<input type='hidden' name="product-id" value={productID} />
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
							</div>
						</Link>
					)
					: (
						<div className="large-grid-container" >
							<input type='hidden' name="product-id" value={productID} />
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

								{
									!clickableGrid && (
										<div className="btn-container">
											<Link prefetch="intent" to={`/product/${productID}`}>
												<RoundButton
													colorScheme="blue"
													onClick={() => onClickProduct(productID)}
												>
													View
												</RoundButton>
											</Link>
										</div>
									)
								}
							</div>
						</div>
					)
			}
		</MqNotifier>
	);
}

export default LargeGrid;
