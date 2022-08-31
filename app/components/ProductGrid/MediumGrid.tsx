import styled from "styled-components";
import { Button } from '@chakra-ui/react';
import type { LinksFunction } from '@remix-run/node';

import { devices } from "~/styles/breakpoints";

import styles from "./styles/MediumGrid.css";


export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	]
}

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
			display: none;
		}
	}
`

const Headline = styled.h3`
	font-size: 14px;
	line-height: 1.3;
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
		<div className="medium-grid-container">
			{/* images */}
			<div className="image-container">
				<img
					className="prod-main-image"
					src={image}
				/>
			</div>

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
		</div>
	);
};
