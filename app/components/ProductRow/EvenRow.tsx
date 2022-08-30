import styled from "styled-components";

import { breakPoints, ranges } from "~/styles/breakpoints";
import type { Product } from "~/shared/lib/types";
import { MediumGrid } from "../ProductGrid";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	gap: 20px 20px;
	flex-wrap: wrap;
	margin: 0 auto;
	justify-content: center;

	@media ${ranges.normalScreen} {
		justify-content: flex-start;
		width: 670px;
		flex-direction: row;
		gap: 20px 8px;
		padding-left: 2px;
	}

	@media ${ranges.tabletPortrait} {
		justify-content: flex-start;
		width: 576px;
		flex-direction: row;
	}

	@media ${ranges.phoneOnly} {
		flex-direction: column;
	}

	& > div {
		@media ${ranges.desktopUp} {
			flex: 33.33%;
		}

		@media (min-width:${breakPoints.PhoneTop}px) and (max-width:${breakPoints.normalScreenTop}px) {
			flex: 50%;
		}
	}
`;


interface EvenRowProps {
	/*
	 *  Take at most 6 products. Render proper layout based on view port size.
	 */
	products: Product[];
}

export default function EvenRow({ products = [] }: EvenRowProps) {
	return (
		<Container>
			{
				products.map((product, key) => (
					<MediumGrid
						key={key}
						image={product.main_pic}
						title={product.title}
						description={product.shortDescription}
					/>
				))
			}
		</Container>
	);
}
