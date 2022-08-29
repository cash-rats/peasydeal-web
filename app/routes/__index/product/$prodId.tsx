import { Button } from "@chakra-ui/react";
import { BsCartPlus } from "react-icons/bs";

import styles from "./styles/ProdDetail.css";
import PriceOffTag, {
	links as PriceTagLinks,
} from "./components/PriceTag";



export function links() {
	return [
		...PriceTagLinks(),

		{
			rel: "stylesheet",
			href: styles
		},
	];
}


function ProductDetailPage () {
	return (
		<div className="container">

			{/* Product Image */}
			{/* > 991 desktop */}
			{/* < 991 mobile view */}
			<div className="product-detail">
				{/* Title */}
				<div className="product-detail-title">
					<h1>
						LED Night Light Projector - 3 Styles & 5 Colours!
					</h1>

					<p>
						£9.99 instead of £49.99 for an LED night light projector from Obero - save 80%
					</p>
				</div>
			</div>

			{/* Product Image */}
			<div className="product-image">
				<picture>
					<source
						height={251}
						srcSet="https://images.wowcher.co.uk/images/deal/24734373/777x520/943967.jpg"
						media="(max-width: 375px)"
					/>

					<source
						height={277}
						srcSet="https://images.wowcher.co.uk/images/deal/24734373/777x520/943967.jpg"
						media="(max-width: 575px)"
					/>

					<img
						src="https://images.wowcher.co.uk/images/deal/24734373/777x520/943967.jpg"
					/>
				</picture>
			</div>

			<div className="product-info-container">
				{/* Price info */}
				<div className="price-info">
					<div className="price-info-left">
							<span className="price">
								$4.99
							</span>

							<span className="orig-price">
								$6.99
							</span>
					</div>

					{/* Price off tag */}

					<div className="price-info-right">
						<span>
							<PriceOffTag moneySaved={2} percentOff={10} />
						</span>
					</div>
				</div>

				{/* availability */}

				{/* Add to cart button */}
				<div className="button-container">
					<Button
						rightIcon={<BsCartPlus />}
						colorScheme="blue"
						width={{ base: '100%', md: 'auto' }}
					>
						Add to cart
					</Button>
				</div>

				{/* Description */}
				<div className="product-desc">
					<div className="desc">
						<strong> Description: </strong> <br/>
						<p>
							Turn an empty bottle into a practical watering device with this dual head bottle cap sprinkler! It works well as a simple watering bottle and is fully sufficient to care about your houseplants.
						</p>
					</div>

					<div className="main-features">
						<strong> Main Feature: </strong> <br/>
						some fetched feature
						<ul>
							<li>
								feature 1
							</li>

							<li>
								feature 2
							</li>
						</ul>
					</div>

					<div className="specification">
						<strong> Specification </strong> <br/>
						<ul>
							<li>
								Spec 1
							</li>
							<li>
								Spec 2
							</li>
							<li>
								Spec 3
							</li>
						</ul>
					</div>

				</div>
			</div>
		</div>
	);
};

export default ProductDetailPage;
