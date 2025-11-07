import { Link, Form } from 'react-router';
import { LazyImage } from '~/components/LazyImage';
import RoundButton from '~/components/RoundButton';
import { links as TiltRibbonLinks } from '~/components/Tags/TiltRibbon';
import { links as ScratchLinks } from '~/components/Tags/Scratch';
import { links as SunShineLinks } from '~/components/Tags/SunShine';
import { links as PennantLeftLinks } from '~/components/Tags/Pennant';
import { composeProductDetailURL } from '~/utils';

import styles from "./styles/LargeGrid.css";
import type { TagsCombo } from './types';

export function links() {
	return [
		...SunShineLinks(),
		...ScratchLinks(),
		...TiltRibbonLinks(),
		...PennantLeftLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

interface LargeGridProps {
	productID: string;
	image: string;
	title: string;
	description?: string;
	onClickProduct?: (title: string, productID: string) => void;
	tagCombo?: TagsCombo;
	discount?: number;
}

function LargeGrid({
	productID,
	image,
	title,
	description,
	onClickProduct = () => { },
	tagCombo = 'none',
	discount = 0,
}: LargeGridProps) {
	// const tagNames = TagComboMap[tagCombo];
	// const shouldRenderTags = normalizeTagsListToMap(tagNames);
	// const nDiscount = ~~(discount * 100);

	return (
		<Link
			// prefetch='intent'
			className="large-grid-container p-2.5"
			to={composeProductDetailURL({ productName: title, productUUID: productID })}
			onClick={(evt) => {
				// The following code prevents redirection triggered by view button
				// evt.preventDefault();
				// return;

				onClickProduct(title, productID)
			}}
		>
			{/* <SaleTags
				shouldRenderTags={shouldRenderTags}
				discount={nDiscount}
			/> */}

			<input type='hidden' name="product-id" value={productID} />
			{/* image */}
			<div
				className="image-container bg-contain bg-center bg-no-repeat"
				style={{ backgroundImage: `url('${image}')` }}
			>
				<LazyImage
					src={image}
					alt={title}
					className='large-grid-image'
					placeholder="/images/placeholder.svg"
				/>
			</div>

			<div className="product-desc-container px-2 py-6">
				<div className="info">
					<div className="headline">
						{title}
					</div>
					<div className="desc">
						{description}
					</div>
				</div>

				<div className="btn-container">
					<Form
						action={composeProductDetailURL({ productName: title, productUUID: productID })}
						method='get'
					>
						<RoundButton
							type='submit'
							colorScheme="cerise"
							onClick={(evt) => {
								evt.stopPropagation();

								// TA recording.
								onClickProduct(title, productID)
							}}
						>
							View
						</RoundButton>
					</Form>
				</div>
			</div>
		</Link>
	);
}

export default LargeGrid;
