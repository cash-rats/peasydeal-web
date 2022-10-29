import { useState } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import MqNotifier from '~/components/MqNotifier';
import RoundButton from '~/components/RoundButton';
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
	onClickProduct = () => { },
}: MediumGridProps) {
	const [clickableGrid, setClickableGrid] = useState<boolean>(false);

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
			{
				clickableGrid
					? (
						<Link
							prefetch='intent'
							to={`/product/${productID}`}
							onClick={() => onClickProduct(productID)}
							className="medium-grid-container"
						>
							{/* images */}
							<div className="image-container">
								<img
									alt={title}
									className="medium-grid-image"
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
							</div>
						</Link>
					)
					: (

						<div
							onClick={
								clickableGrid
									? () => onClickProduct(productID)
									: () => { }
							}
							className="medium-grid-container"
						>
							{/* images */}
							<div className="image-container">
								<img
									alt={title}
									className="medium-grid-image"
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
									<Link prefetch="intent" to={`/product/${productID}`}>
										<RoundButton
											colorScheme="blue"
											onClick={() => onClickProduct(productID)}
											style={{
												padding: '0.675rem 1.5rem'
											}}
										>
											View
										</RoundButton>
									</Link>
								</div>
							</div>
						</div>
					)
			}
		</MqNotifier>
	);
};
