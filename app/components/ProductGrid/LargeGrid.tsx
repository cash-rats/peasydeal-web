import styled from "styled-components";
import { Button } from "@chakra-ui/react";
import { devices } from "~/styles/breakpoints";

import styles from "./styles/LargeGrid.css";

export function links() {
	return [
		{ rel: "stylesheet", href: styles },
	];
}

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px 0px;

	@media ${devices.tabletPortraitUp} {
		max-width: 566px;
		height: 574px;
	}

	@media ${devices.normalScreen} {
		max-width: 666px;
		height: 589px;
	}

	@media ${devices.desktopUp} {
		max-width: 727px;
		height: 621px;
	}
`;

const ProductDescContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	padding: 11px;
	height: 100%;
	@media ${devices.phoneOnly} {
		position: absolute;
		left: 0;
		bottom: 0;
		align-items: flex-end;
	}
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
	@media ${devices.phoneOnly} {
		display: none;
	}
`;

const BtnContainer = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
	@media ${devices.phoneOnly} {
		display: none;
	}
`;

interface LargeGridProps {
	productID: string;
	image: string;
	title: string;
	description: string;
	onClickProduct?: (productID: string) => void;
}

// > 1200, flex:2; height
function LargeGrid({
	productID,
	image,
	title,
	description,
	onClickProduct = () => {},
}: LargeGridProps) {
	return (
		<Container className="large-grid-container">
			{/* image */}
			<div className="image-container">
				<img className="large-grid-image" src={image} />
			</div>

			<ProductDescContainer>
				<Info>
					<Headline>
						{title}
					</Headline>
					<Desc>
						{description}
					</Desc>
				</Info>

				<BtnContainer>
					<Button
						colorScheme="blue"
						size="lg"
						onClick={() => onClickProduct(productID)}
					>
						View
					</Button>
				</BtnContainer>
			</ProductDescContainer>
		</Container>
	);
}

export default LargeGrid;
