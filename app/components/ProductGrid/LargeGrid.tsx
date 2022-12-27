import { useState, useEffect } from 'react';
import { Link, Form } from '@remix-run/react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { ScrollPosition } from "react-lazy-load-image-component";

import RoundButton from '~/components/RoundButton';
import { breakPoints } from '~/styles/breakpoints';
import TiltRibbon, { links as TiltRibbonLinks } from '~/components/Tags/TiltRibbon';
import Scratch, { links as ScratchLinks } from '~/components/Tags/Scratch';
import SunShine, { links as SunShineLinks } from '~/components/Tags/SunShine';
import PennantLeft, { links as PennantLeftLinks } from '~/components/Tags/Pennant';
import { composeProductDetailURL } from '~/utils';

import styles from "./styles/LargeGrid.css";
import type { TagsCombo } from './types';
import { TagComboMap } from './types';
import { normalizeTagsListToMap } from './utils';
import type { RenderableTagMap } from './utils';

export function links() {
	return [
		...SunShineLinks(),
		...ScratchLinks(),
		...TiltRibbonLinks(),
		...PennantLeftLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

const renderTags = (shouldRenderTags: RenderableTagMap, discount: number) => {
	return (
		<>
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
					<Scratch text={`${discount}% off`} direction='right' />
				)
			}

			{
				shouldRenderTags['SUN_LEFT'] && (
					<SunShine text={`${discount}% off`} direction='left' />
				)
			}

			{
				shouldRenderTags['SUN_RIGHT'] && (
					<SunShine text={`${discount}% off`} direction='right' />
				)
			}

			{
				shouldRenderTags['PENNANT_LEFT'] && (
					<PennantLeft text1='price off' text2={`${discount}%`} />
				)
			}

			{
				shouldRenderTags['PENNANT_RIGHT'] && (
					<PennantLeft text1='price off' text2={`${discount} %`} direction='right' />
				)
			}
		</>

	)
}

interface LargeGridProps {
	productID: string;
	image: string;
	title: string;
	description?: string;
	onClickProduct?: (title: string, productID: string) => void;
	tagCombo?: TagsCombo;
	discount?: number;
	scrollPosition?: ScrollPosition;
}

function LargeGrid({
	productID,
	image,
	title,
	description,
	onClickProduct = () => { },
	tagCombo = 'none',
	discount = 0,
	scrollPosition,
}: LargeGridProps) {
	const [clickableGrid, setClickableGrid] = useState<boolean>(false);
	const tagNames = TagComboMap[tagCombo];
	const shouldRenderTags = normalizeTagsListToMap(tagNames);
	const nDiscount = ~~(discount * 100);

	const isClickableGrid = (): boolean => {
		const windowDOM = window as Window;
		if (!windowDOM) return false;
		return windowDOM.innerWidth <= breakPoints.phoneTop;
	}

	useEffect(() => {
		const handleResize = () => {
			setClickableGrid(isClickableGrid());
		};
		if (window) {
			setClickableGrid(isClickableGrid());
			window.addEventListener('resize', handleResize);
		}
	}, []);

	return (
		<Link
			// prefetch='intent'
			className="large-grid-container"
			to={composeProductDetailURL({ productName: title, variationUUID: productID })}
			onClick={(evt) => {
				if (!isClickableGrid()) {
					evt.preventDefault();
					return;
				}

				onClickProduct(title, productID)
			}}
		>
			{
				renderTags(shouldRenderTags, nDiscount)
			}
			<input type='hidden' name="product-id" value={productID} />
			{/* image */}
			<div className="image-container">
				<LazyLoadImage
					src={image}
					className='large-grid-image'
					alt={title}
					scrollPosition={scrollPosition}
					placeholder={
						<img
							alt={title}
							src="/images/placeholder.svg"
							className='large-grid-image'
						/>
					}
				/>
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
					<Form
						action={composeProductDetailURL({ productName: title, variationUUID: productID })}
						method='get'
					>
						<RoundButton
							type='submit'
							colorScheme="cerise"
							onClick={(evt) => {
								evt.stopPropagation();
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
