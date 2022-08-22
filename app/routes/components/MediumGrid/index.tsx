
import styled from "styled-components";
import { devices } from "~/styles/breakpoints";

import { Button } from '@chakra-ui/react';

const Container = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	flex: 1;
	max-width: 353.33px;
	max-height: 306px;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px 0px;
`

const ImageContainer = styled.div`
	width: 100%;
	height: 100%;
`

const ProductDescContainer = styled.div`
	display: flex;
	padding: 11px;
`

const LeftDesc = styled.div`
	border: solid 1px;
`

const RightDesc = styled.div`
	border: solid 1px;
`

// - [ ] Basic product grid. do not consider wrapper layout.
// - [ ] breakpoint: > desktopUp, 1 row  has 3 columns
// - [ ] Image should be as large as the grid width
// - [ ] Do not display product description on medium grid
export default function MediumGrid() {
	return (
		<Container>
			{/* images */}
			<ImageContainer>
				<picture>
					<source
						srcSet="https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg" />
					<source srcSet="https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg" />

					<img src="https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg" />

				</picture>
			</ImageContainer>

			{/* Product Description */}
			<ProductDescContainer>
				<LeftDesc>
					{/* topic */}
					<h2>
						Pop Up Gazebo - Beige, Black, Green, or Grey!
					</h2>
				</LeftDesc>
				<RightDesc>
					<Button>
						View
					</Button>
				</RightDesc>
			</ProductDescContainer>
		</Container>
	);
};
