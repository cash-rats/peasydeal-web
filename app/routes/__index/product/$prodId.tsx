import {
	useCallback,
	useState,
	useEffect,
	useRef,
} from 'react';
import type { ChangeEvent } from 'react';
import type { LoaderFunction, ActionFunction, MetaFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher, NavLink } from '@remix-run/react';
import Select from 'react-select';
import { TbTruckDelivery, TbTruckReturn, TbShare } from 'react-icons/tb';
import Rating from '@mui/material/Rating';
import type { DynamicLinksFunction } from 'remix-utils';

import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs/Breadcrumbs';
import Divider, { links as DividerLinks } from '~/components/Divider';
import ClientOnly from '~/components/ClientOnly';
import QuantityPicker, { links as QuantityPickerLinks } from '~/components/QuantityPicker';
import { commitSession } from '~/sessions/redis_session';
import { insertItem } from '~/sessions/shoppingcart.session';
import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';
import ItemAddedModal, { links as ItemAddedModalLinks } from '~/components/PeasyDealMessageModal/ItemAddedModal';
import RightTiltBox, { links as RightTiltBoxLinks } from '~/components/Tags/RightTiltBox';
import {
	getCanonicalDomain,
	getProdDetailTitleText,
	getProdDetailDescText,
	getProdDetailDescTextWithoutPrice,
} from '~/utils';

import type { ProductDetail, ProductVariation } from './types';
import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar, { links as ProductActionBarLinks } from './components/ProductActionBar';
import ProductActionBarLeft, { links as ProductActionBarLeftLinks } from './components/ProductActionBarLeft';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import SocialShare, { links as SocialShareLinks } from './components/SocialShare';
import TopProductsColumn, { links as TopProductsColumnLinks } from './components/TopProductsColumn';
import useStickyActionBar from './hooks/useStickyActionBar';

type LoaderTypeProductDetail = {
	product: ProductDetail;
	canonical_url: string;
};

export const meta: MetaFunction = ({ data }: { data: LoaderTypeProductDetail }) => {
	const defaultVariation: ProductVariation | undefined = data.product.variations.find(variation => variation.uuid === data.product.default_variation_uuid);

	let description = getProdDetailDescTextWithoutPrice(data.product.title)
	if (defaultVariation) {
		description = getProdDetailDescText(
			data.product.title,
			defaultVariation.retail_price,
			defaultVariation.sale_price,
		)
	}

	return {
		title: getProdDetailTitleText(data.product.title, data.product.uuid),
		description,
	}
};

export const links: LinksFunction = () => {
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
		...TopProductsColumnLinks(),
		...RightTiltBoxLinks(),
		{ rel: "stylesheet", href: styles },
	];
};


const dynamicLinks: DynamicLinksFunction<LoaderTypeProductDetail> = ({ data }) => {
	return [
		{
			rel: 'canonical', href: data.canonical_url,
		},
	];
}
export const handle = { dynamicLinks };

// Fetch product detail data.
export const loader: LoaderFunction = async ({ params, request }) => {
	const { prodId } = params;
	if (!prodId) return redirect('/');

	console.log('debug 1', prodId);
	const prodDetail = await fetchProductDetail(prodId)
	console.log('debug 2', prodDetail);

	return json<LoaderTypeProductDetail>({
		product: prodDetail,
		canonical_url: `${getCanonicalDomain()}/product/${prodId}`
	});
};

type __action_type = 'to_product_detail' | 'add_item_to_cart' | 'buy_now';

// TODO
//  - [x] store shopping cart items in session storage if user has not logged in yet.
//  - [ ] what is error?
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formObj = Object.fromEntries(form.entries());
	const formAction = formObj['__action'] as __action_type;

	if (formAction === 'to_product_detail') {
		let prodUuid: FormDataEntryValue | null = formObj['productUUID'];
		return redirect(`product/${prodUuid}`);
	}

	const cartObj = Object.fromEntries(form.entries()) as ShoppingCartItem;

	// If item does not have a valid productUUID, don't insert it to shopping cart.
	if (!cartObj || !cartObj.variationUUID || cartObj.variationUUID === 'undefined') {
		return json('');
	}

	const session = await insertItem(request, cartObj);

	if (formAction == 'buy_now') {
		return redirect('/cart', {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}

	if (formAction === 'add_item_to_cart') {
		return json('', {
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		});
	}

	// unknown action type.
	return null;
}

/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
 * TODO
 *   - [ ] image should be changed to carousel images.
 *         Display carousel images if variation is greater than 1
 */
function ProductDetailPage() {
	const data = useLoaderData<LoaderTypeProductDetail>();
	const [productDetail, setProductDetail] = useState<ProductDetail>(data.product);
	const [mainCategory] = productDetail.categories;

	const productContentWrapperRef = useRef<HTMLDivElement>(null);
	const mobileUserActionBarRef = useRef<HTMLDivElement>(null);

	useStickyActionBar(mobileUserActionBarRef, productContentWrapperRef);
	const [quantity, updateQuantity] = useState<number>(1);
	const [variation, setVariation] = useState<ProductVariation | undefined>(
		productDetail.variations.find(
			variation => productDetail.default_variation_uuid === variation.uuid
		)
	);

	useEffect(() => {
		setProductDetail(data.product);
	}, [data]);

	useEffect(() => {
		const currentVariation = productDetail.variations.find(
			variation => productDetail.default_variation_uuid === variation.uuid
		)

		setVariation(currentVariation);
	}, [productDetail]);

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

	const extractProductInfo = useCallback(() => {
		// A product doesn't have any `spec_name` if the product has 1 variation only
		// other wise `Default Title` would appeared in `/cart`.
		const specName = productDetail.variations.length === 1
			? ''
			: variation?.spec_name || ''

		return {
			salePrice: variation?.sale_price.toString() || '',
			retailPrice: variation?.retail_price.toString() || '',
			productUUID: productDetail.uuid,
			variationUUID: variation?.uuid || '',

			// product variation does not have "main_pic" yet, thus, we take the first product image to be displayed in shopping cart.
			image: productDetail.images[0] || '',
			quantity: quantity.toString(),
			title: productDetail?.title || '',
			specName: specName,
		}
	}, [productDetail, quantity, variation]);

	const handleAddToCart = () => {
		if (!variation) {
			setVariationErr('Please pick a variation');

			return;
		}
		setVariationErr('');

		const orderInfo = { ...extractProductInfo() };
		addToCart.submit(
			{
				__action: 'add_item_to_cart',
				...extractProductInfo(),
			} as ShoppingCartItem & { __action: __action_type },
			{ method: 'post', action: `/product/${orderInfo.productUUID}` },
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
	}, [addToCart.type])

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

			<div className="ProductDetail__breadcrumbs">
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
				<div className="ProductDetail__main-wrapper">
					<div className='ProductDetail__main-top'>
						<ProductDetailSection
							description={productDetail?.description}
							pics={productDetail.images}
							title={productDetail?.title}
						/>

						<div
							ref={productContentWrapperRef}
							className="product-content-wrapper"
						>
							<div className="product-content">
								<h1 className="product-name">
									{productDetail?.title}
								</h1>

								{
									productDetail.num_of_raters > 0
										? (

											<div className="ProductDetailPage__rating">
												<Rating
													name="product-rating"
													defaultValue={productDetail.rating}
													precision={0.1}
													readOnly
												/>

												<span className="ProductDetailPage__review-count">
													({productDetail.num_of_raters} reviews)
												</span>
											</div>

										)
										: null
								}


								<div className="product-tag-bar">
									<p className="detail-amount">
										£{variation?.sale_price}
									</p>

									<span className="actual-amount">
										compared at £{variation?.retail_price}
									</span>

								</div>

								<div className="ProductDetailPage__annotation">
									<p className="discount-amount">
										YOU SAVE &nbsp;
										{
											variation && variation.discount && (
												(Number(variation.discount) * 100).toFixed(0)
											)
										}%!
									</p>

									<div className="ProductDetailPage__number-bought">
										<RightTiltBox text={`${productDetail.order_count} bought`} />
									</div>
								</div>


								<div className="bought">
									<span className="availability-text"> availability: </span>
									<span className="in-stock-text" > in-stock </span>
								</div>

								<Divider text="options" />
								<div className="options-container">
									<ClientOnly>
										{
											productDetail.variations.length > 1
												? (
													<>
														<Select
															inputId='variation_id'
															instanceId='variation_id'
															placeholder='select variation'
															value={{
																value: variation?.uuid,
																label: variation?.spec_name,
															}}
															onChange={(v) => {
																if (!v) return;
																setVariation(
																	productDetail.variations.find(variation => variation.uuid === v.value)
																);
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
													</>
												)
												: null
										}
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
										<strong> {variation?.delivery_info} </strong>
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
					<div className="ProductDetail__main-bottom">
						<RecommendedProducts
							category={mainCategory.name}
							onClickProduct={handleClickProduct}
						/>
					</div>
				</div>

				<div className="ProductDetail__desktop-ads-container">
					<TopProductsColumn />
				</div>
			</div>

		</>
	);
};

export default ProductDetailPage;
