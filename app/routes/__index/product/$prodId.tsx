import { useCallback, useState, ChangeEvent } from 'react';
import {
	InputGroup,
	Input,
	InputLeftAddon,
	InputRightAddon,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { BiMinus } from 'react-icons/bi';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Button } from '@chakra-ui/react';
import Select from 'react-select';
import { TbTruckDelivery } from 'react-icons/tb';
import { StatusCodes } from 'http-status-codes';

import Divider, { links as DividerLinks } from '~/components/Divider';
import ClientOnly from '~/components/ClientOnly';
import { getSession, commitSession } from '~/sessions';
//import { shoppingCartCookie } from '~/cookies/shopping_cart';

import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";

export function links() {
	return [
		...ProductDetailSectionLinks(),
		...DividerLinks(),
		{ rel: "stylesheet", href: styles },
	];
};


// Fetch product detail data.
export const loader: LoaderFunction = async ({ params }) => {
	const { prodId } = params;
	if (!prodId) return null;
	const resp = await fetchProductDetail(prodId)
	const respJSON = await resp.json();

	return json({ product: respJSON }, { status: StatusCodes.OK });
};

// TODO
//  - [x] store shopping cart items in session storage if user has not logged in yet.
//  - [ ] what is error?
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const prodIDEntry: FormDataEntryValue | null = form.get('productID');
	if (!prodIDEntry) return;
	const prodID = prodIDEntry as string;

	const cartObj = Object.fromEntries(form.entries());

	// Try retrieve `shopping_cart` list from request cookie.
	const session = await getSession(
		request.headers.get("Cookie"),
	);

	// if `shopping_cart` has not been created, create it
	let shoppingCart = {};

	if (session.has('shopping_cart')) {
		shoppingCart = session.get('shopping_cart');
	}

	const newShoppingCart = {
		...shoppingCart,
		[prodID]: cartObj ,
	}

	session.set('shopping_cart', newShoppingCart);

	return new Response('', {
		headers: {
			"Set-Cookie": await commitSession(session),
		}
	});
}

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
	pics: string[];
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

	const selectCurrentVariation = useCallback((defaultVariationID: string, variations: ProductVariation[]): ProductVariation | undefined => {
		return variations.find<ProductVariation>(
			(variation) =>  defaultVariationID === variation.variationId);
	}, []);
	const currentVariation = selectCurrentVariation(productDetail.defaultVariationId, productDetail.variations);

	// Item quantity.
	const [quantity, updateQuantity] = useState<number>(1);

	const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
		if (isNaN(Number(evt.target.value))) return;
		updateQuantity(Number(evt.target.value));
	};

	const increaseQuantity = () => {
		updateQuantity(prev => prev+1);
	};
	const decreaseQuantity = () => {
		if (quantity === 1) return;
		updateQuantity(prev => prev-1);
	};

	const addToCart = useFetcher();
	const handleAddToCart = () => {
		console.log('debug 1');
		 // - retrieve product info via productID.
		 // - ask action store shopping cart item in the cookie.
		 //params
			 //prodID: {
				 //variationID
				 //variation title
				 //image
				 //quantity
				 //title
				 //description
			//}

		//console.log('debug 1', );
		addToCart.submit(
			{
				productID: productDetail.productId,
				variationID: currentVariation?.variationId || '',
				image: currentVariation?.mainPic || '',
				quantity: quantity.toString(),
				title: currentVariation?.title || '',
				subTitle: currentVariation?.subTitle || '',
			},
			{ method: 'post', action: '/product/$prodId' },
		);
	};


	return (
		<div className="productdetail-container">
			<ProductDetailSection
				title={currentVariation?.title}
				subTitle={currentVariation?.subTitle}
				description={currentVariation?.description}
				pics={productDetail.pics}
			/>

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

						{/* Variations */}
						<ClientOnly>
							<Select
								inputId='variation_id'
								instanceId='variation_id'
								placeholder='select variation~'
								options={
									productDetail.variations.map(
										(variation) => ({ value: variation.variationId, label: variation.title })
									)
								}
							/>
						</ClientOnly>

						{/* Quantity */}
						<div className="input-quantity-container">
							<InputGroup size='sm'>
								<InputLeftAddon
									children={<BiMinus />}
									onClick={decreaseQuantity}
								/>
								<Input
									value={quantity}
									onChange={handleUpdateQuantity}
								/>
								<InputRightAddon
									children={<BsPlus />}
									onClick={increaseQuantity}
								/>
							</InputGroup>
						</div>

						<div className="client-action-bar-large">
							<div>
								<Button
									width={{ base: '100%' }}
									colorScheme='green'
									onClick={handleAddToCart}
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
						onClick={handleAddToCart}
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
