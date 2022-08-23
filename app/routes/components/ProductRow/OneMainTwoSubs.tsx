import styled from "styled-components";

import { ranges } from "~/styles/breakpoints";
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
`

const Right = styled.div`
	display: flex;

	@media ${ranges.normalScreen} {
		flex-direction: row;
		gap: 10px;
	}

	@media ${ranges.tabletPortrait} {
		flex-direction: row;
		gap: 8px;
	}

	@media ${ranges.phoneOnly} {
		flex-direction: column;
		gap: 20px;
	}
`

export default function OneMainTwoSubs() {
	return (
		<Container>
			<Left>
				<LargeGrid />
			</Left>

			<Right>
				<MediumGrid />
				<MediumGrid />
			</Right>
		</Container>
	);
}
