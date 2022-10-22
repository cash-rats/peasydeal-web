import { useState } from "react";
import type { LinksFunction } from "@remix-run/node";

import type { Product } from "~/shared/types";
import MqNotifier from '~/components/MqNotifier';
import { breakPoints } from '~/styles/breakpoints';

import MediumGrid, { links as MediumGridLinks } from "../ProductGrid/MediumGrid";
import LargeGrid, { links as LargeGridLinks } from "../ProductGrid/LargeGrid";
import styles from "./styles/OneMainTwoSubs.css";

export const links: LinksFunction = () => {
	return [
		...MediumGridLinks(),
		...LargeGridLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

interface LeftLayoutProps {
	product?: Product;
	onClickProduct?: (productUUID: string) => void;
};

function LeftLayout({ product, onClickProduct = () => { } }: LeftLayoutProps) {
	return (
		<div className="left">
			{
				product && (
					<LargeGrid
						productID={product.productUUID}
						image={product.main_pic}
						title={product.title}
						description={product.description}
						onClickProduct={onClickProduct}
					/>
				)
			}

		</div>
	)
};

interface RightLayoutProps {
	products?: Product[];
	onClickProduct?: (productUUID: string) => void;
};

function RightLayout({ products = [], onClickProduct = () => { } }: RightLayoutProps) {
	const [one, two] = products;
	return (

		<div className="right">
			{
				one && (
					<MediumGrid
						productID={one.productUUID}
						image={one.main_pic}
						title={one.title}
						description={one.shortDescription}
						onClickProduct={onClickProduct}
					/>
				)
			}

			{
				two && (
					<MediumGrid
						productID={two.productUUID}
						image={two.main_pic}
						title={two.title}
						description={two.shortDescription}
						onClickProduct={onClickProduct}
					/>
				)
			}
		</div>

	);
};

interface OneMainTwoSubsProps {
	/*
	 * Takes in 3 products at most.
	 */
	products?: Product[];

	/*
	 * Reverse left and right when screen size > 1199.
	 */
	reverse?: boolean;

	/*
	 * Callback when clicks on product.
	 */
	onClickProduct?: (productID: string) => void;
};

// What if we only have 1, or 2 products?
function OneMainTwoSubs({
	products = [],
	reverse = false,
	onClickProduct = () => { },
}: OneMainTwoSubsProps) {
	const [one, two, three] = products;
	const [enoughForReverse, setEnoughForReverse] = useState(false);

	const checkWidthEnoughForReverse = (dom: Window) => dom.innerWidth > breakPoints.normalScreenTop;

	return (
		<MqNotifier
			mqValidators={[
				{
					condition: (dom: Window) => checkWidthEnoughForReverse(dom),
					callback: (dom: Window) => setEnoughForReverse(checkWidthEnoughForReverse(dom))
				},
			]}
		>
			<div className="one-main-two-subs-container">
				{
					reverse && enoughForReverse
						? (
							<>
								<RightLayout
									products={[one, two]}
									onClickProduct={onClickProduct}
								/>

								<LeftLayout
									product={three}
									onClickProduct={onClickProduct}
								/>
							</>
						)
						: (
							<>
								<LeftLayout
									product={one}
									onClickProduct={onClickProduct}
								/>

								<RightLayout
									products={[two, three]}
									onClickProduct={onClickProduct}
								/>
							</>
						)
				}
			</div>
		</MqNotifier>
	);
}

export default OneMainTwoSubs;
