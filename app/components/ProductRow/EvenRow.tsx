import type { LinksFunction } from '@remix-run/node';

import type { Product } from "~/shared/types";

import styles from './styles/EventRow.css';
import { MediumGrid } from "../ProductGrid";

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
}

interface EvenRowProps {
	/*
	 *  Take at most 6 products. Render proper layout based on view port size.
	 */
	products: Product[];

	onClickProduct?: (productID: string) => void;
}

export default function EvenRow({ products = [], onClickProduct = () => { } }: EvenRowProps) {
	return (
		<div className="even-row-contianer">
			{
				products.map((product) => (
					<MediumGrid
						key={product.productID}
						productID={product.productID}
						onClickProduct={onClickProduct}
						image={product.main_pic}
						title={product.title}
						description={product.shortDescription}
					/>
				))
			}
		</div>
	);
}
