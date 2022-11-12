import { useState } from 'react';
import { Link } from '@remix-run/react';

import RoundButton from '~/components/RoundButton';
import MqNotifier from '~/components/MqNotifier';
import { breakPoints } from '~/styles/breakpoints';

import styles from "./styles/LargeGrid.css";
import type { TagsCombo } from './types';
import { TagComboMap } from './types';
import { normalizeTagsListToMap } from './utils';

import TiltRibbon, { links as TiltRibbonLinks } from '~/components/Tags/TiltRibbon';
import Scratch, { links as ScratchLinks } from '~/components/Tags/Scratch';
import SunShine, { links as SunShineLinks } from '~/components/Tags/SunShine';
import PennantLeft, { links as PennantLeftLinks } from '~/components/Tags/Pennant';

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
	onClickProduct?: (productID: string) => void;
	tagCombo?: TagsCombo;
}

function LargeGrid({
	productID,
	image,
	title,
	description,
	onClickProduct = () => { },
	tagCombo = 'none',
}: LargeGridProps) {
	const [clickableGrid, setClickableGrid] = useState<boolean>(false);
	const tagNames = TagComboMap[tagCombo];
	const shouldRenderTags = normalizeTagsListToMap(tagNames);

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
							{
								shouldRenderTags['NEW_LEFT'] && (
									<TiltRibbon text='new' direction='left' />
								)
							}

							{
								shouldRenderTags['NEW_RIGHT'] && (
									<TiltRibbon text='new' direction='right' />
								)
							}

							{
								shouldRenderTags['SCRATCH_RIGHT'] && (
									<Scratch text='50% off' direction='right' />
								)
							}

							{
								shouldRenderTags['SUN_LEFT'] && (
									<SunShine text='50% off' direction='left' />
								)
							}

							{
								shouldRenderTags['SUN_RIGHT'] && (
									<SunShine text='50% off' direction='right' />
								)
							}

							{
								shouldRenderTags['PENNANT_LEFT'] && (
									<PennantLeft text1='price off' text2='20%' />
								)
							}
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

							{
								shouldRenderTags['NEW_LEFT'] && (
									<TiltRibbon text='new' direction='left' />
								)
							}

							{
								shouldRenderTags['NEW_RIGHT'] && (
									<TiltRibbon text='new' direction='right' />
								)
							}

							{
								shouldRenderTags['SCRATCH_RIGHT'] && (
									<Scratch text='50% off' direction='right' />
								)
							}

							{
								shouldRenderTags['SUN_LEFT'] && (
									<SunShine text='50% off' direction='left' />
								)
							}

							{
								shouldRenderTags['SUN_RIGHT'] && (
									<SunShine text='50% off' direction='right' />
								)
							}

							{
								shouldRenderTags['PENNANT_LEFT'] && (
									<PennantLeft text1='price off' text2='20%' />
								)
							}

							{
								shouldRenderTags['PENNANT_RIGHT'] && (
									<PennantLeft text1='price off' text2='20%' direction='right' />
								)
							}
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
													colorScheme="cerise"
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
