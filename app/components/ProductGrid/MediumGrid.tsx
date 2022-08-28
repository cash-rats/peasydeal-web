import styled from "styled-components";
import { devices } from "~/styles/breakpoints";

import { Button } from '@chakra-ui/react';

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px 0px;
	@media ${devices.tabletPortraitUp} {
		max-width: 273px;
	}

	@media ${devices.normalScreen} {
		max-width: 329px;
	}

	@media ${devices.desktopUp} {
		max-width: 353.33px;
	}
`

const ImageContainer = styled.div`
	width: 100%;
	height: 100%;
	@media ${devices.phoneOnly} {
		&:after {
			content: '';
  		position: absolute;
  		top: 0;
  		left: 0;
  		right: 0;
  		bottom: 0;
  		background: linear-gradient(to bottom, transparent 0%, black 170%);
		}
	}
`

const ProductDescContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 11px;
	@media ${devices.phoneOnly} {
		position: absolute;
		left: 0;
		bottom: 0;
	}
`;

const ProdInfo = styled.div`
	p {
		display: none;
		color: white;
	}

	@media ${devices.phoneOnly} {
		p {
			display: block;
		}
	}
`

const Headline = styled.h3`
	font-size: 14px;
	font-weight: bold;
	margin: 0;
	color: rgb(51, 51, 51);
	@media ${devices.phoneOnly} {
		color: white;
		font-size: 16px;
	}
`;

const ViewBtnContainer = styled.div`
	@media ${devices.phoneOnly} {
		display: none;
	}
`

interface MediumGridProps {
	image: string;
	title: string;
	description: string;
};

// - [ ] Basic product grid. do not consider wrapper layout.
// - [ ] breakpoint: > desktopUp, 1 row  has 3 columns
// - [ ] Image should be as large as the grid width
// - [ ] Do not display product description on medium grid
// -
//      > 0 && < 599 100%x380px, 1 grid
//      >= 600: 273px256px, 2 grid
//      > 1199: 353.33x306, 3 grids flex 1
//      > 767: 323x290, 2 grids flex 1
export default function MediumGrid({ image, title, description }: MediumGridProps) {
	return (
		<Container>
			{/* images */}
			<ImageContainer>
				<picture>
					<source
						srcSet={image} />
					<source srcSet={image} />

					<img src={image} />

				</picture>
			</ImageContainer>

			{/* Product Description */}
			<ProductDescContainer>
				<ProdInfo>
					{/* topic */}
					<Headline>
						{title}
					</Headline>

					<p>
						{description}
					</p>
				</ProdInfo>
				<ViewBtnContainer>
					<Button colorScheme="blue">
						View
					</Button>
				</ViewBtnContainer>
			</ProductDescContainer>

			{/* Description */}
		</Container>
	);
};
