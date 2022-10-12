import { useCallback, useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import {
	InputGroup,
	Input,
	InputLeftAddon,
	InputRightAddon,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { BiMinus } from 'react-icons/bi';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher, NavLink } from '@remix-run/react';
import Select from 'react-select';
import { TbTruckDelivery } from 'react-icons/tb';
import { StatusCodes } from 'http-status-codes';
import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';

import { useSuccessSnackbar } from '~/components/Snackbar';
import Divider, { links as DividerLinks } from '~/components/Divider';
import ClientOnly from '~/components/ClientOnly';
import { getSession, commitSession } from '~/sessions';
import type { SessionKey } from '~/sessions';

import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar, { links as ProductActionBarLinks } from './components/ProductActionBar';
import ProductActionBarLeft, { links as ProductActionBarLeftLinks } from './components/ProductActionBarLeft';

export function links() {
	return [
		...ProductDetailSectionLinks(),
		...DividerLinks(),
		...BreadCrumbsLinks(),
		...ProductActionBarLinks(),
		...ProductActionBarLeftLinks(),
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
	const formAction = form.get('__action');

	if (!prodIDEntry) return;
	const prodID = prodIDEntry as string;

	const cartObj = Object.fromEntries(form.entries());

	// Try retrieve `shopping_cart` list from request cookie.
	const session = await getSession(
		request.headers.get("Cookie"),
	);

	// if `shopping_cart` has not been created, create it.
	let shoppingCart = {};
	if (session.has('shopping_cart' as SessionKey)) {
		shoppingCart = session.get('shopping_cart');
	}

	const newShoppingCart = {
		...shoppingCart,
		[prodID]: cartObj,
	}

	session.set('shopping_cart', newShoppingCart);

	if (formAction == 'buy_now') {
		return redirect('/cart', {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}

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
	subTitle: string;
	title: string;
	variationId: string;
};

interface ProductDetail {
	categories: string[];
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
function ProductDetailPage() {
	const productDetailData = useLoaderData<{ product: ProductDetail }>();
	const productDetail = productDetailData.product;
	const [mainCategory] = productDetail.categories;


	const selectCurrentVariation = useCallback((defaultVariationID: string, variations: ProductVariation[]): ProductVariation | undefined => {
		return variations.find<ProductVariation>(
			(variation) => defaultVariationID === variation.variationId);
	}, []);

	const productContentWrapperRef = useRef<HTMLDivElement>(null);
	const mobileUserActionBarRef = useRef<HTMLDivElement>(null);

	const handleWindowScrolling = (evt: Event) => {
		if (!window || !productContentWrapperRef.current || !mobileUserActionBarRef.current) return;
		const windowDOM = window as Window;
		const prodContentRect = productContentWrapperRef.current.getBoundingClientRect();

		const isScrollAtDivBottom = windowDOM.innerHeight + windowDOM.scrollY >= prodContentRect.bottom + windowDOM.scrollY;

		if (isScrollAtDivBottom) {
			if (mobileUserActionBarRef.current.style.position === 'relative') return;
			mobileUserActionBarRef.current.style.position = 'relative';
		} else {

			if (mobileUserActionBarRef.current.style.position === 'fixed') return;
			mobileUserActionBarRef.current.style.position = 'fixed';
		}
	};

	// Scroll to top when this page is rendered since `ScrollRestoration` would keep the scroll position at the bottom.
	useEffect(() => {
		if (window) {
			window.scrollTo(0, 0);

			// Listen to scroll position of window, if window scroll bottom is at bottom position of productContentWrapperRef
			// change position of `productContentWrapperRef` from `fixed` to `relative`.
			window.addEventListener('scroll', handleWindowScrolling);
		}

		return () => window.removeEventListener('scroll', handleWindowScrolling);
	}, []);


	const currentVariation = selectCurrentVariation(productDetail.defaultVariationId, productDetail.variations);

	// Item quantity.
	const [quantity, updateQuantity] = useState<number>(1);

	const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
		if (isNaN(Number(evt.target.value))) return;
		updateQuantity(Number(evt.target.value));
	};

	const increaseQuantity = () => {
		updateQuantity(prev => prev + 1);
	};

	const decreaseQuantity = () => {
		if (quantity === 1) return;
		updateQuantity(prev => prev - 1);
	};

	const addToCart = useFetcher();
	const buyNow = useFetcher();

	const extractProductInfo = useCallback(() => (
		{
			salePrice: currentVariation?.salePrice.toString() || '',
			retailPrice: currentVariation?.retailPrice.toString() || '',
			productID: productDetail.productId,
			variationID: currentVariation?.variationId || '',
			image: currentVariation?.mainPic || '',
			quantity: quantity.toString(),
			title: currentVariation?.title || '',
			subTitle: currentVariation?.subTitle || '',
		}
	), [currentVariation, productDetail, quantity]);

	const [openSuccessSnackbar] = useSuccessSnackbar();

	const handleAddToCart = () => {
		addToCart.submit(
			{
				__action: 'add_to_cart',
				...extractProductInfo(),
			},
			{ method: 'post', action: '/product/$prodId' },
		);
	};

	const handleBuyNow = () => {
		// Add this item to shopping cart (session).
		// Redirect to checkout page after it's added to cart.
		buyNow.submit({
			__action: 'buy_now',
			...extractProductInfo(),

		}, { method: 'post', action: '/product/$prodId' });
	}

	useEffect(() => {
		if (addToCart.type === 'done') {
			openSuccessSnackbar('Added to cart');
		}
	}, [addToCart])

	return (
		<div>
			<div className="productdetail-breadcrumbs">
				<Breadcrumbs breadcrumbs={[
					<NavLink
						className={({ isActive }) => (
							isActive
								? "breadcrumbs-link breadcrumbs-link-active"
								: "breadcrumbs-link"
						)}
						key='1'
						to={`/${mainCategory}`}
					>
						{mainCategory}
					</NavLink>,
					<NavLink
						className={({ isActive }) => (
							isActive
								? "breadcrumbs-link breadcrumbs-link-active"
								: "breadcrumbs-link"
						)}
						key='1'
						to={`/product/${productDetail.productId}`}
					>
						{currentVariation?.title}
					</NavLink>,
				]} />
			</div>

			<div className="productdetail-container">
				<ProductDetailSection
					title={currentVariation?.title}
					subTitle={currentVariation?.subTitle}
					description={currentVariation?.description}
					pics={productDetail.pics}
				/>


				<div
					ref={productContentWrapperRef}
					className="product-content-wrapper"
				>
					<div className="product-content">
						<h1 className="product-name">
							{currentVariation?.title}
						</h1>


						<div className="product-tag-bar">
							<p className="detail-amount">
								{currentVariation?.currency}{currentVariation?.salePrice}
							</p>

							<p className="actual-amount">
								compared at {currentVariation?.currency} {currentVariation?.retailPrice}
							</p>

							<p className="discount-amount">
								SAVE
								{
									currentVariation && currentVariation.discountOff && (
										(
											((currentVariation.retailPrice - currentVariation.salePrice) / currentVariation.retailPrice) * 100
										).toFixed(0)
									)
								} %
							</p>

						</div>

						<div className="bought">
							<span className="bought-number">
								{productDetail.bought}
							</span>
							<span className="bought-text"> bought </span>

							<span className="in-stock-text" > in-stock </span>
						</div>



						<Divider text="options" />
						<div className="options-container">

							{/* Variations */}
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

							<ProductActionBarLeft
								onClickAddToCart={handleAddToCart}
								onClickBuyNow={handleBuyNow}
								loading={addToCart.state !== 'idle'}
							/>
						</div>


						<Divider text="Share" />
						<div className="sales-end-timer">
							<span className="timer">
								<span className="readable-time" >6 days left</span> <span className="time">20:42:53</span>
							</span>
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

					<div className="client-action-bar-wrapper">
						<ProductActionBar
							ref={mobileUserActionBarRef}
							onClickAddToCart={handleAddToCart}
							onClickBuyNow={handleBuyNow}
							loading={addToCart.state !== 'idle'}
						/>
					</div>
				</div>


				{/* TODO More products */}
			</div>
		</div>
	);
};

export default ProductDetailPage;
