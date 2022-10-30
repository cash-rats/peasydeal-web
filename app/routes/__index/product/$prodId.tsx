import { useCallback, useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher, NavLink } from '@remix-run/react';
import Select from 'react-select';
import { TbTruckDelivery, TbTruckReturn, TbShare } from 'react-icons/tb';

import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';
import Divider, { links as DividerLinks } from '~/components/Divider';
import ClientOnly from '~/components/ClientOnly';
import QuantityPicker, { links as QuantityPickerLinks } from '~/components/QuantityPicker';
import { commitSession } from '~/sessions';
import { insertItem } from '~/utils/shoppingcart.session';
import type { ShoppingCartItem } from '~/utils/shoppingcart.session';
import ItemAddedModal, { links as ItemAddedModalLinks } from '~/components/PeasyDealMessageModal/ItemAddedModal';

import type { ProductDetail, ProductVariation } from './types';
import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar, { links as ProductActionBarLinks } from './components/ProductActionBar';
import ProductActionBarLeft, { links as ProductActionBarLeftLinks } from './components/ProductActionBarLeft';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import SocialShare, { links as SocialShareLinks } from './components/SocialShare';

export function links() {
	return [
		...ItemAddedModalLinks(),
		...QuantityPickerLinks(),
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

type LoaderTypeProductDetail = {
	product: ProductDetail;
};

// Fetch product detail data.
export const loader: LoaderFunction = async ({ params, context }) => {
	const { prodId } = params;
	if (!prodId) return redirect('/');

	const prodDetail = await fetchProductDetail(prodId)

	return json<LoaderTypeProductDetail>({ product: prodDetail });
};


// TODO
//  - [x] store shopping cart items in session storage if user has not logged in yet.
//  - [ ] what is error?
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formAction = form.get('__action');

	if (formAction === 'to_product_detail') {
		let prodUuid: FormDataEntryValue | null = form.get('productUUID');
		return redirect(`product/${prodUuid}`);
	}

	const cartObj = Object.fromEntries(form.entries()) as ShoppingCartItem;
	const session = await insertItem(request, cartObj);

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

/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
 * TODO
 *   - [ ] image should be changed to carousel images.
 *         Display carousel images if variation is greater than 1
 */
function ProductDetailPage() {
	const { product: productDetail } = useLoaderData<LoaderTypeProductDetail>();
	const [mainCategory] = productDetail.categories;

	const selectCurrentVariation = (defaultVariationUUID: string, variations: ProductVariation[]): ProductVariation | undefined => {
		return variations.find(
			(variation) => defaultVariationUUID === variation.uuid);
	};

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

		return window.removeEventListener('scroll', handleWindowScrolling);
	}, []);

	const currentVariation = selectCurrentVariation(productDetail.default_variation_uuid, productDetail.variations);
	const [quantity, updateQuantity] = useState<number>(1);
	const [variation, setVariation] = useState<string>('');
	const [variationErr, setVariationErr] = useState<string>('');
	const [openSuccessModal, setOpenSuccessModal] = useState(false);

	const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
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
			salePrice: currentVariation?.sale_price.toString() || '',
			retailPrice: currentVariation?.retail_price.toString() || '',
			productUUID: productDetail.uuid,
			variationUUID: currentVariation?.uuid || '',

			// product variation does not have "main_pic" yet, thus, we take the first product image to be displayed in shopping cart.
			image: productDetail.images[0] || '',
			quantity: quantity.toString(),
			title: productDetail?.title || '',
			specName: currentVariation?.spec_name || '',
		}
	), [currentVariation, productDetail, quantity]);

	const handleAddToCart = () => {
		if (!variation) {
			setVariationErr('Please pick a variation');

			return;
		}
		setVariationErr('');

		addToCart.submit(
			{ ...extractProductInfo() },
			{ method: 'post', action: '/product/$prodId' },
		);
	};

	const handleBuyNow = () => {
		if (!variation) {
			setVariationErr('Please pick a variation');

			return
		}
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
			setOpenSuccessModal(true);

			setTimeout(() => {
				setOpenSuccessModal(false);
			}, 1000)
		}
	}, [addToCart])

	const toProductDetailFetcher = useFetcher();

	const handleClickProduct = (productUUID: string) => {
		toProductDetailFetcher.submit({
			__action: 'to_product_detail',
			productUUID,
		}, { method: 'post' });
	}

	const handleOnClose = () => {
		setOpenSuccessModal(false);
	}

	return (
		<>
			<ItemAddedModal
				open={openSuccessModal}
				onClose={handleOnClose}
			/>
			<div className="productdetail-breadcrumbs">
				<Breadcrumbs breadcrumbs={[
					<NavLink
						className={({ isActive }) => (
							isActive
								? "breadcrumbs-link breadcrumbs-link-active"
								: "breadcrumbs-link"
						)}
						key='1'
						to='/'
					>
						Home
					</NavLink>,
					<NavLink
						className={({ isActive }) => (
							isActive
								? "breadcrumbs-link breadcrumbs-link-active"
								: "breadcrumbs-link"
						)}
						key='2'
						to={`/${mainCategory.name}`}
					>
						{mainCategory.name}
					</NavLink>,
					<NavLink
						className={({ isActive }) => (
							isActive
								? "breadcrumbs-link breadcrumbs-link-active"
								: "breadcrumbs-link"
						)}
						key='3'
						to={`/product/${productDetail.uuid}`}
					>
						{productDetail?.title}
					</NavLink>,
				]} />
			</div>

			<div className="productdetail-container">
				<ProductDetailSection
					description={productDetail?.description}
					pics={productDetail.images}
				/>

				<div
					ref={productContentWrapperRef}
					className="product-content-wrapper"
				>


					<div className="product-content">
						<h1 className="product-name">
							{productDetail?.title}
						</h1>

						<h1 className="product-subtitle">
							{currentVariation?.spec_name}
						</h1>

						<div className="product-tag-bar">
							<p className="detail-amount">
								{
									// TODO: enable currency
									// currentVariation?.currency
								} {currentVariation?.sale_price}
							</p>

							<span className="actual-amount">
								compared at {

									// TODO: enable currency
									// currentVariation?.currency
								} {currentVariation?.retail_price}
							</span>

						</div>

						<p className="discount-amount">
							YOU SAVE &nbsp;
							{
								currentVariation && currentVariation.discount && (
									(Number(currentVariation.discount) * 100).toFixed(0)
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

										setVariation(v.value);
									}}
									options={
										productDetail.variations.map(
											(variation) => ({ value: variation.uuid, label: variation.spec_name })
										)
									}
								/>

								<p className="error">
									{variationErr}
								</p>
							</ClientOnly>

							{/* Quantity */}
							<div className="input-quantity-container">
								<QuantityPicker
									value={quantity}
									onChange={handleUpdateQuantity}
									onIncrease={increaseQuantity}
									onDecrease={decreaseQuantity}
								/>
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
								<span> {currentVariation?.delivery_info} </span>
							</div>
						</div>


						<div className="product-features-mobile">
							<Divider text="product features" />

							{/* TODO dangerous render html */}
							<div dangerouslySetInnerHTML={{ __html: productDetail?.description || '' }} className="product-features-container" />
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

						<div className="client-action-bar-wrapper">
							<Divider />
							<ProductActionBar
								ref={mobileUserActionBarRef}
								onClickAddToCart={handleAddToCart}
								onClickBuyNow={handleBuyNow}
								loading={addToCart.state !== 'idle'}
							/>
						</div>
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
				category={mainCategory.name}
				onClickProduct={handleClickProduct}
			/>
		</>
	);
};

export default ProductDetailPage;
