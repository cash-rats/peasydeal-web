import styled from "styled-components";
import { OneMainTwoSubs } from "../components/ProductRow";

const Container = styled.div`
	padding-top: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ProductRow = styled.div`
	padding-top: 20px;
`

export default function Index() {
	return (
		<>
			{/* display product lists */}
			<Container>
				<ProductRow>
					<OneMainTwoSubs />
				</ProductRow>

				<ProductRow>
					<OneMainTwoSubs />
				</ProductRow>

				<ProductRow>
					<OneMainTwoSubs />
				</ProductRow>
			</Container>
		</>
	);
}
