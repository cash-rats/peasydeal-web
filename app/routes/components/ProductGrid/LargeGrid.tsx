import styled from "styled-components";
import { Button } from "@chakra-ui/react";

import { devices } from "~/styles/breakpoints";

const Container = styled.div`
	position: relative;
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px 0px;
	@media ${devices.desktopUp} {
		max-width: 727px;
		max-height: 632px;
	}
`;

const ImageContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const ProductDescContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 11px;
`;

const Info = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	flex: 4;
`;

const Headline = styled.h2`
	font-size: 18px;
	font-weight: bold;
	margin: 0;
	color: rgb(51, 51, 51);
	@media ${devices.phoneOnly} {
		color: white;
		font-size: 16px;
	}
`;

const Desc = styled.span`
`;

const BtnContainer = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
`;

// > 1200, flex:2; height
function LargeGrid() {
	return (
		<Container>
			{/* image */}
			<ImageContainer>
				<picture>
					<source
						srcSet="https://images.wowcher.co.uk/images/deal/24721229/777x520/941941.jpg" />
					<source srcSet="https://images.wowcher.co.uk/images/deal/24721229/777x520/941941.jpg" />

					<img src="https://images.wowcher.co.uk/images/deal/24721229/777x520/941941.jpg" />
				</picture>
			</ImageContainer>

			<ProductDescContainer>
				<Info>
					<Headline>
						Stranger Things Inspired Hat - Blue, white, Black and Red
					</Headline>
					<Desc>
						£7.99 instead of £19.99 for a Stranger Things inspired hat from One More Ideal- save 60%
					</Desc>
				</Info>

				<BtnContainer>
					<Button colorScheme="blue" size="lg">
						View
					</Button>
				</BtnContainer>
			</ProductDescContainer>
		</Container>
	);
}

export default LargeGrid;
