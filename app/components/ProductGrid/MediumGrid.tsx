import type { LinksFunction } from '@remix-run/node';
import { Link, Form } from '@remix-run/react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { ScrollPosition } from 'react-lazy-load-image-component';

import RoundButton from '~/components/RoundButton';
import { links as TiltRibbonLinks } from '~/components/Tags/TiltRibbon';
import { links as ScratchLinks } from '~/components/Tags/Scratch';
import { links as SunShineLinks } from '~/components/Tags/SunShine';
import { links as PennantLeftLinks } from '~/components/Tags/Pennant';
import SaleTags from './SaleTag';

import { composeProductDetailURL } from '~/utils';

import { normalizeTagsListToMap } from './utils';
import type { TagsCombo } from './types';
import { TagComboMap } from './types';
import styles from "./styles/MediumGrid.css";

export const links: LinksFunction = () => {
	return [
		...SunShineLinks(),
		...ScratchLinks(),
		...TiltRibbonLinks(),
		...PennantLeftLinks(),
		{ rel: 'stylesheet', href: styles },
	]
}

interface MediumGridProps {
	productID: string;
	image: string;
	title: string;
	description?: string;
	onClickProduct?: (title: string, productID: string) => void;
	tagCombo?: TagsCombo | null;
	discount?: number;
	scrollPosition?: ScrollPosition;
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
	tagCombo = 'none',
	discount = 0,
	scrollPosition,
}: MediumGridProps) {
	// retrieve tags name in the provided combo. If given grid does not have
	// any `tagCombo`, we initialize `tagNames` to empty array.
	const shouldRenderTags = normalizeTagsListToMap(!tagCombo
		? []
		: TagComboMap[tagCombo]
	);
	const nDiscount = ~~(discount * 100);

	return (
		<Link
			// prefetch='intent'
			to={composeProductDetailURL({ productName: title, variationUUID: productID })}
			onClick={(evt) => {
				// if (!isClickableGrid()) {
				// 	evt.preventDefault();
				// 	return;
				// }

				onClickProduct(title, productID)
			}}
			className="medium-grid-container  p-2.5"
		>
			<SaleTags
				shouldRenderTags={shouldRenderTags}
				discount={nDiscount}
			/>

			{/* images */}
			<div
				className="image-container bg-contain bg-center bg-no-repeat"
				style={{ backgroundImage: `url('${image}')`}}
			>
				<LazyLoadImage
					placeholder={
						<img
							src="/images/placeholder.svg"
							alt={title}
							className="medium-grid-image"
						/>
					}
					alt={title}
					className="medium-grid-image  opacity-0"
					src={image}
					scrollPosition={scrollPosition}
				/>
			</div>

			{/* Product Description */}
			<div className="product-desc-container px-2 py-6">
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
					<Form
						method='get'
						action={composeProductDetailURL({ productName: title, variationUUID: productID })}
					>
						<RoundButton
							type='submit'
							colorScheme="cerise"
							onClick={(evt) => {
								evt.stopPropagation();
								onClickProduct(title, productID)
							}}
							style={{
								padding: '0.675rem 1.5rem'
							}}
						>
							View
						</RoundButton>
					</Form>
				</div>
			</div>
		</Link>
	);
};
