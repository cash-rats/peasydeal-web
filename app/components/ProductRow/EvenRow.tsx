import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component'

import MediumGridSkeleton, { links as MediumGridSkeletonLinks } from "~/components/ProductGrid/MediumGridSkeleton";
import type { Product } from "~/shared/types";

import styles from './styles/EventRow.css';
import type { TagsCombo } from '../ProductGrid/types';
import { MediumGrid } from "../ProductGrid";

export const links: LinksFunction = () => {
	return [
		...MediumGridSkeletonLinks(),
		{ rel: 'stylesheet', href: styles },
	];
}

interface EvenRowProps {
	// Take at most 6 products. Render proper layout based on view port size.
	products?: Product[];

	onClickProduct?: (productID: string) => void;

	loading?: boolean;
	scrollPosition?: ScrollPosition;
}

export default function EvenRow({
	loading = false,
	products = [],
	onClickProduct = () => { },
	scrollPosition,
}: EvenRowProps) {

	return (
		<div className="even-row-contianer">
			{
				loading
					? (
						<>
							{
								(new Array(6)).fill(0).map((_, idx) => {
									return (
										<MediumGridSkeleton key={idx} />
									)
								})
							}
						</>
					)
					: (
						products.map((product, index: number) => (
							<MediumGrid
								key={index}
								productID={product.productUUID}
								onClickProduct={onClickProduct}
								image={product.main_pic}
								title={product.title}
								description={product.shortDescription}
								tagCombo={product.tabComboType as TagsCombo | null}
								discount={product.discount}
								scrollPosition={scrollPosition}
							/>
						)
						)
					)
			}
		</div>
	);
}
