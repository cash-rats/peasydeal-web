import type { LinksFunction } from "@remix-run/node";

import styles from "./styles/PriceTag.css";

export const links: LinksFunction = () => {
	return [
		{
			rel: "stylesheet",
			href: styles
		},
	]
};

interface PriceTagProps {
	moneySaved: number;
	percentOff: number;
}

function PriceTag ({ moneySaved, percentOff }: PriceTagProps) {
	return (
		<span className="price-tag price-tag--one-line" data-separator=", ">
		  <span className="price-tag__main">SAVED ${moneySaved}</span>
		  <span>{percentOff}% off</span>
		</span>
	);
};

export default PriceTag;
