import Select from 'react-select';
import { Button } from '@chakra-ui/react';
import Divider, { links as DividerLinks } from '~/components/Divider';

import styles from "./styles/ProdDetail.css";
import PriceOffTag, {
	links as PriceTagLinks,
} from "./components/PriceTag";



export function links() {
	return [
		...DividerLinks(),
		...PriceTagLinks(),
		{
			rel: "stylesheet",
			href: styles
		},
	];
}

interface ProductDetailPageProps {
	src: string;
}

/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
 * TODO
 *   - [ ] image should be changed to carousel.
 */
function ProductDetailPage ({
	src = 'https://images.discountexperts.com/i/v5_19disyt3dry_28.jpg',
}: ProductDetailPageProps) {
	return (
		<div className="productdetail-container">

			{/* Product Image */}
			{/* > 991 desktop */}
			{/* < 991 mobile view */}
			<div className="product-detail">
				{/* Title */}
				<div className="product-detail-title">
					<h1>
						LED Night Light Projector - 3 Styles & 5 Colours!
					</h1>

					<h2>
						£9.99 instead of £49.99 for an LED night light projector from Obero - save 80%
					</h2>
				</div>

				{/* Image container */}
				<div className="product-detail-img-container">
					<img
						src={src}
					/>
				</div>

			</div>

			{/* Product detail */}
			<div className="product-content-wrapper">
				<div className="product-content">

					<div className="product-tag-bar">
						<p className="purchased-detail-text">
							NOW
						</p>

						<p className="detail-amount">
							<b>
								14.99
							</b>
						</p>

						<p className="actual-amount">
							was 49.99
						</p>
					</div>

					<div className="lure-text">
						<span className="lure1">
							Discount <b> 70% </b>
						</span>
						<span className="lure2">
							You save <b> 35.00 </b>
						</span>
						<span className="lure3">
							Sold <b> 17 </b>
						</span>
					</div>

					<Divider text="sales ends" />

					<div className="sales-end-timer">
						<span className="timer">
							<span className="readable-time" >6 days left</span> <span className="time">20:42:53</span>
						</span>
					</div>

					<Divider text="options" />

					<div className="options-container">
						<Select
							placeholder='select variation'
							options={[
								{value: 'aaa', label: 'aaa'},
								{value: 'bbb', label: 'bbb'},
								{value: 'ccc', label: 'ccc'},
								{value: 'ddd', label: 'ddd'},
							]}
						/>
					</div>

					<Divider text="product features" />

					{/* TODO dangerous render html */}
					<div className="product-features-container">
						Bug vacuum: Get a LED bug vacuum.
						Two options: Choose from an oval or egg shaped vacuum.
						Inhales bugs: Designed to inhale mosquitoes and bugs into the lamp.
						Sleek design: Modern sleek finish.
						Size: 13cm (L) x 13cm (W) x 22.8cm (H).
						Home appliances: Great for the summertime when bugs appear in the home!
					</div>

					<Divider text="cancellation and returns" />

					<div className="product-return-policy">
						<p>
							14 days cancellation period applies.
						</p>
					</div>
				</div>
			</div>

			<div className="client-action-bar">
				<div>
					<Button
						width={{ base: '100%' }}
						colorScheme='green'
					>
						Add To Cart
					</Button>
				</div>

				<div>
					<Button
						width={{ base: '100%' }}
						colorScheme='orange'
					>
						Buy Now
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetailPage;
