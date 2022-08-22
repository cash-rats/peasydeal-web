import styled from "styled-components";

import { LargeGrid, MediumGrid } from "../ProductGrid";

const Container = styled.div`


`

export default function OneMainTwoSubs() {
	return (
		<Container>
			<LargeGrid />

			<MediumGrid />
			<MediumGrid />
		</Container>
	);
}
