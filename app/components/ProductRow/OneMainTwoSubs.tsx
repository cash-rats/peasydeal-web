import { useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import type { Product } from "~/shared/types";
import MqNotifier from '~/components/MqNotifier';
import { breakPoints } from '~/styles/breakpoints';


import type { TagsCombo } from '~/components/ProductGrid/types';
import MediumGrid, { links as MediumGridLinks } from "~/components/ProductGrid/MediumGrid";
import MediumGridSkeleton, { links as MediumGridSkeletonLinks } from "~/components/ProductGrid/MediumGridSkeleton";
import LargeGridSkeleton, { links as LargeGridSkeletonLinks } from "../ProductGrid/LargeGridSkeleton";
import LargeGrid, { links as LargeGridLinks } from "../ProductGrid/LargeGrid";
import styles from "./styles/OneMainTwoSubs.css";

export const links: LinksFunction = () => {
	return [
		...MediumGridLinks(),
		...LargeGridLinks(),
		...MediumGridSkeletonLinks(),
		...LargeGridSkeletonLinks(),

		{ rel: 'stylesheet', href: styles },
	];
};

interface LeftLayoutProps {
	product?: Product;
	onClickProduct?: (title: string, productUUID: string) => void;
	loading?: boolean
};

function LeftLayout({
	product,
	onClickProduct = () => { },
	loading = false,
}: LeftLayoutProps) {
	if (loading) {
		return (
			<div className="left">
				<LargeGridSkeleton />
			</div>
		);
	}

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
	onClickProduct?: (title: string, productUUID: string) => void;
	loading?: boolean;
};

function RightLayout({
	loading = false,
	products = [],
	onClickProduct = () => { }
}: RightLayoutProps) {
	const [one, two] = products;

	if (loading) {
		return (
			<div className="right">
				<MediumGridSkeleton />
				<MediumGridSkeleton />
			</div>
		)
	}

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
						tagCombo={one.tabComboType as TagsCombo | null}
						discount={one.discount}
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
						discount={two.discount}
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
	onClickProduct?: (title: string, productID: string) => void;

	loading?: boolean;
};

// What if we only have 1, or 2 products?
function OneMainTwoSubs({
	products = [],
	reverse = false,
	onClickProduct = () => { },
	loading = false,
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
					loading
						? (
							<>
								<LeftLayout loading />
								<RightLayout loading />
							</>
						)
						: (
							<>
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
							</>
						)
				}
			</div>
		</MqNotifier>
	);
}

export default OneMainTwoSubs;
