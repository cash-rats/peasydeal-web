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
import { TbTruckDelivery, TbTruckReturn, TbShare } from 'react-icons/tb';
import { StatusCodes } from 'http-status-codes';
import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';

import { useSuccessSnackbar } from '~/components/Snackbar';
import Divider, { links as DividerLinks } from '~/components/Divider';
import ClientOnly from '~/components/ClientOnly';
import { getSession, commitSession } from '~/sessions';
import type { SessionKey } from '~/sessions';
import { fetchProductsByCategory } from '~/api';
import type { Product } from '~/shared/types';

import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar, { links as ProductActionBarLinks } from './components/ProductActionBar';
import ProductActionBarLeft, { links as ProductActionBarLeftLinks } from './components/ProductActionBarLeft';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import SocialShare, { links as SocialShareLinks } from './components/SocialShare';

export function links() {
	return [
		...ProductDetailSectionLinks(),
		...DividerLinks(),
		...BreadCrumbsLinks(),
		...ProductActionBarLinks(),
		...ProductActionBarLeftLinks(),
		...RecommendedProductsLinks(),
		...SocialShareLinks(),
		{ rel: "stylesheet", href: styles },
	];
};

type LoaderTypeRecommendedProducts = {
	products: Product[];
}

// Fetch product detail data.
export const loader: LoaderFunction = async ({ params, request }) => {
	const { prodId } = params;
	if (!prodId) return redirect('/');

	const url = new URL(request.url);
	const action = url.searchParams.get('__action') || '';

	if (action === 'recommended_products') {
		const category = url.searchParams.get('category') || 'Hot Deal';

		const recProds = await fetchProductsByCategory({ category });
		return json<LoaderTypeRecommendedProducts>({ products: recProds });
	}

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

	if (formAction === 'to_product_detail') {
		return redirect(`product/${prodIDEntry}`);
	}

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
		[prodIDEntry]: cartObj,
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
	deliveryInfo: string;
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

	const selectCurrentVariation = useCallback(
		(defaultVariationID: string, variations: ProductVariation[]): ProductVariation | undefined => {
			return variations.find(
				(variation) => defaultVariationID === variation.variationId);
		}, []
	);

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

	const loadRecommendedProduct = useFetcher();
	const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

	// Scroll to top when this page is rendered since `ScrollRestoration` would keep the scroll position at the bottom.
	useEffect(() => {
		if (window) {
			window.scrollTo(0, 0);

			// Listen to scroll position of window, if window scroll bottom is at bottom position of productContentWrapperRef
			// change position of `productContentWrapperRef` from `fixed` to `relative`.
			window.addEventListener('scroll', handleWindowScrolling);
			// Load recommended product on the client side to reduce render time.
			loadRecommendedProduct.submit(
				{
					__action: 'recommended_products',
					category: mainCategory,
				},
				{ method: 'get', action: '/product/$prodId' }
			);
		}

		return () => window.removeEventListener('scroll', handleWindowScrolling);
	}, []);

	// Recommende product has been loaded
	useEffect(() => {
		if (loadRecommendedProduct.type === 'done') {
			setRecommendedProducts(loadRecommendedProduct.data.products);
		}
	}, [loadRecommendedProduct]);


	const currentVariation = selectCurrentVariation(productDetail.defaultVariationId, productDetail.variations);
	const [quantity, updateQuantity] = useState<number>(1);
	const [variation, setVariation] = useState<string>('');
	const [variationErr, setVariationErr] = useState<string>('');

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
		setVariationErr('Please pick a variation');

		if (!variation) return
		setVariationErr('');

		addToCart.submit(
			{
				__action: 'add_to_cart',
				...extractProductInfo(),
			},
			{ method: 'post', action: '/product/$prodId' },
		);
	};

	const handleBuyNow = () => {
		setVariationErr('Please pick a variation');

		if (!variation) return
		setVariationErr('');

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

	const toProductDetailFetcher = useFetcher();

	const handleClickProduct = (productID: string) => {
		toProductDetailFetcher.submit({
			__action: 'to_product_detail',
			productID,
		}, { method: 'post' });
	}

	return (
		<>
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

						<h1 className="product-subtitle">
							{currentVariation?.subTitle}
						</h1>

						<div className="product-tag-bar">
							<p className="detail-amount">
								{currentVariation?.currency}{currentVariation?.salePrice}
							</p>

							<span className="actual-amount">
								compared at {currentVariation?.currency} {currentVariation?.retailPrice}
							</span>

						</div>

						<p className="discount-amount">
							YOU SAVE &nbsp;
							{
								currentVariation && currentVariation.discountOff && (
									(
										((currentVariation.retailPrice - currentVariation.salePrice) / currentVariation.retailPrice) * 100
									).toFixed(0)
								)
							}%!
						</p>


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
									onChange={(v) => {
										if (!v) return;

										console.log('debug 1');
										setVariation(v.value);
									}}
									options={
										productDetail.variations.map(
											(variation) => ({ value: variation.variationId, label: variation.title })
										)
									}
								/>

								<p className="error">
									{variationErr}
								</p>
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


						{/*
							- Facebook
							- Twitter
							- Whatsapp
						*/}
						<Divider text={
							<span className="ProductDetail__divder-content">
								<TbShare fontSize={20} /> share
							</span>
						} />
						<SocialShare />

						<div className="delivery-container">
							<Divider text={(
								<span className="ProductDetail__divder-content">
									<TbTruckDelivery fontSize={24} /> DELIVERY
								</span>
							)} />

							<div className="delivery-content">
								<span> {currentVariation.deliveryInfo} </span>
							</div>
						</div>


						<div className="product-features-mobile">
							<Divider text="product features" />

							{/* TODO dangerous render html */}
							<div dangerouslySetInnerHTML={{ __html: currentVariation?.description || '' }} className="product-features-container" />
						</div>

						<div className="product-return-policy">
							<Divider text={(
								<span className="ProductDetail__divder-content">
									<TbTruckReturn fontSize={24} /> return policy
								</span>
							)} />

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


			</div>

			{/*
					Recommended products:
						- Things you might like: other products that belongs to the same category.
					  - Hot deals
						- New trend
				*/}
			<RecommendedProducts
				products={recommendedProducts}
				onClickProduct={handleClickProduct}
			/>
		</>
	);
};

export default ProductDetailPage;
