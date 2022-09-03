import { useCallback } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Select from 'react-select';
import { Button } from '@chakra-ui/react';
import { TbTruckDelivery } from 'react-icons/tb';
import { StatusCodes } from 'http-status-codes';

import Divider, { links as DividerLinks } from '~/components/Divider';
import ClientOnly from '~/components/ClientOnly';


import styles from "./styles/ProdDetail.css";
//import PriceOffTag, {
	//links as PriceTagLinks,
//} from "./components/PriceTag";



export function links() {
	return [
		...DividerLinks(),
		//...PriceTagLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

// Fetch product detail data.
export const loader: LoaderFunction = async ({ params }) => {
	const { prodId } = params;
	const { MYFB_ENDPOINT } = process.env;
	const resp = await fetch(`${MYFB_ENDPOINT}/data-server/ec/product?id=${prodId}`)
	const respJSON = await resp.json();

	return json({ product: respJSON }, { status: StatusCodes.OK });
};


interface ProductVariation {
	currency: null
	description: string;
	discountOff: number;
	mainPic: string;
	productId: string;
	retailPrice: number;
	salePrice: number;
	shippingFee: number;
	shortDescription: string;
	sku: string;
	subTitle:  string;
	title: string;
	variationId: string;
};

interface ProductDetail {
	bought: number;
	currency: string;
	defaultVariationId: string;
	productId: string
	variations: ProductVariation[];
};

/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
 * TODO
 *   - [ ] image should be changed to carousel images.
 *         Display carousel images if variation is greater than 1
 */
function ProductDetailPage () {
	const productDetailData = useLoaderData();
	const productDetail: ProductDetail = productDetailData.product;

	console.log('prodDetailData', productDetail);

	const selectCurrentVariation = useCallback((defaultVariationID: string, variations: ProductVariation[]): ProductVariation | undefined => {
		return variations.find<ProductVariation>((variation) =>  defaultVariationID === variation.variationId);
	}, []);

	const currentVariation = selectCurrentVariation(productDetail.defaultVariationId, productDetail.variations);

	//const currentVariation = prodDetailData.variations[prodDetailData.defaultVariationId];

	console.log('currentVariation', currentVariation);

	return (
		<div className="productdetail-container">

			{/* Product Image */}
			{/* > 991 desktop */}
			{/* < 991 mobile view */}
			<div className="product-detail">
				{/* Title */}
				<div className="product-detail-title">
					<h1>
						{ currentVariation?.title }
					</h1>

					<h2>
						{ currentVariation?.subTitle }
					</h2>
				</div>

				{/* Image container */}
				<div className="product-detail-img-container">
					<img
						src={currentVariation?.mainPic}
					/>
				</div>

				{/* product features. display > 768 */}

				<div className="product-features-large-screen">
					<h1>
						Product Features
					</h1>
					{/* TODO dangerous render html */}
					<div dangerouslySetInnerHTML={{ __html: currentVariation?.description || '' }} />
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
								{ currentVariation?.currency } { currentVariation?.salePrice }
							</b>
						</p>

						<p className="actual-amount">
							was { currentVariation?.currency } { currentVariation?.retailPrice }
						</p>
					</div>

					<div className="lure-text">
						<span className="lure1">
							Discount <b>
								{
									currentVariation && currentVariation.discountOff && (
										(
											((currentVariation.retailPrice - currentVariation.salePrice) / currentVariation.retailPrice) * 100
										).toFixed(0)
									)
								}%
							</b>
						</span>
						<span className="lure2">
							You save <b> {
									currentVariation && (currentVariation.retailPrice - currentVariation.salePrice).toFixed(2)
								}
							</b>
						</span>
						<span className="lure3">
							Sold <b> { productDetail.bought } </b>
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
						<ClientOnly>
							<Select
								inputId='variation_id'
								instanceId='variation_id'
								placeholder='select variation'
								options={
									productDetail.variations.map(
										(variation) => ({ value: variation.variationId, label: variation.title })
									)
								}
							/>
						</ClientOnly>

						<div className="client-action-bar-large">
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

					<div className="delivery-container">
						<Divider text="delivery" />

						<div className="delivery-content">
							<span> <TbTruckDelivery fontSize={30} /> </span>
							<span> £4.99  delivery charge per voucher </span>
						</div>
					</div>


					<div className="product-features-mobile">
						<Divider text="product features" />

						{/* TODO dangerous render html */}
						<div dangerouslySetInnerHTML={{ __html: currentVariation?.description || '' }} className="product-features-container" />
					</div>


					<div className="product-return-policy">
						<Divider text="return policy" />

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

			{/* TODO More products */}
		</div>
	);
};

export default ProductDetailPage;
