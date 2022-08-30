import type { LinksFunction } from "@remix-run/node";
import styled from "styled-components";

import { ranges } from "~/styles/breakpoints";
import type { Product } from "~/shared/lib/types";

import MediumGrid, { links as MediumGridLinks } from "../ProductGrid/MediumGrid";
import LargeGrid from "../ProductGrid/LargeGrid";

export const links: LinksFunction = () => {
	return [
		...MediumGridLinks(),
	]
}

const Container = styled.div`
	display: flex;
	gap: 20px 20px;
	justify-content: center;
	@media ${ranges.phoneOnly} {
		flex-direction: column;
	}

	@media ${ranges.normalScreen} {
		flex-direction: column;
	}

	@media ${ranges.tabletPortrait} {
		flex-direction: column;
	}
`
const Left = styled.div`
	display: flex;
	justify-content: center;
`

const Right = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	gap: 20px 0;

	@media ${ranges.normalScreen} {
		flex-direction: row;
		gap: 10px;
	}

	@media ${ranges.tabletPortrait} {
		flex-direction: row;
		gap: 20px;
	}

	@media ${ranges.phoneOnly} {
		flex-direction: column;
		gap: 20px;
	}

`

interface OneMainTwoSubsProps {
	// Takes in 3 products at most.
	products?: Product[];
};

const defaultProps = {
	products: [],
}

// What if we only have 1, or 2 products?
function OneMainTwoSubs({ products = [] }: OneMainTwoSubsProps) {
	const [ one, two, three ] = products;

	return (
		<Container>
			<Left>
				{
					one && (
						<LargeGrid />
					)
				}
			</Left>

			<Right>
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
			</Right>
		</Container>
	);
}

OneMainTwoSubs.defaultProps = defaultProps;

export default OneMainTwoSubs;
