import { useEffect, useRef, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import clsx from "clsx";

import type { Product } from "~/shared/lib/types";

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
	onClickProduct = () => {},
}: OneMainTwoSubsProps) {
	const [ one, two, three ] = products;
	//const sizeEnoughForReverse = useRef<boolean>(false);
	const [enoughForReverse, setEnoughForReverse] = useState(false);

	const checkWidthEnoughForRevers = (dom: Window) => dom.innerWidth > 1199;
	const handleWindowResize = (evt: Event) => {
		const target = evt.target as Window;
		setEnoughForReverse(checkWidthEnoughForRevers(target));
	}

	useEffect(() => {
		//sizeEnoughForReverse.current = checkWidthEnoughForRevers(window)
		setEnoughForReverse( checkWidthEnoughForRevers(window));
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	}, [])

	return (
		<div
			className={clsx({
				"one-main-two-subs-container": true,
				"reverse": reverse && enoughForReverse,
			})}
		>
			<div className="left">
				{
					one && (
						<LargeGrid
							productID={one.productID}
							image={one.main_pic}
							title={one.title}
							description={one.description}
							onClickProduct={onClickProduct}
						/>
					)
				}
			</div>

			<div className="right">
				{
					two && (
						<MediumGrid
							image={two.main_pic}
							title={two.title}
							description={two.shortDescription}
						/>
					)
				}

				{
					three && (
						<MediumGrid
							image={three.main_pic}
							title={three.title}
							description={three.shortDescription}
						/>
					)
				}
			</div>
		</div>
	);
}

export default OneMainTwoSubs;
