import styled from "styled-components";

import { ranges } from "~/styles/breakpoints";

import type { Product } from "./index";
import { LargeGrid, MediumGrid } from "../ProductGrid";

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
	products?: Array<Product>;
};

const defaultProps = {
	products: [],
}

// What if we only have 1, or 2 products?
function OneMainTwoSubs({ products }: OneMainTwoSubsProps) {
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
							image={two.image}
							title={two.title}
							description={two.description}
						/>
					)
				}

				{
					three && (
						<MediumGrid
							image={three.image}
							title={three.title}
							description={three.description}
						/>
					)
				}
			</Right>
		</Container>
	);
}

OneMainTwoSubs.defaultProps = defaultProps;

export default OneMainTwoSubs;
