import {
	useCallback,
	useState,
	useEffect,
	useRef,
} from 'react';
import type { ChangeEvent } from 'react';
import type { LoaderFunction, ActionFunction, MetaFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import Select from 'react-select';
import { TbTruckDelivery, TbTruckReturn, TbShare } from 'react-icons/tb';
import Rating from '@mui/material/Rating';
import type { DynamicLinksFunction } from 'remix-utils';
import httpStatus from 'http-status-codes';

import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';
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
	decomposeProductDetailURL,
	composeProductDetailURL,
} from '~/utils';

import Breadcrumbs from './components/Breadcrumbs';
import Divider from './components/DividerContent';
import type { ProductDetail, ProductVariation } from './types';
import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar, { links as ProductActionBarLinks } from './components/ProductActionBar';
import ProductActionBarLeft, { links as ProductActionBarLeftLinks } from './components/ProductActionBarLeft';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import SocialShare, { links as SocialShareLinks } from './components/SocialShare';
import TopProductsColumn from './components/TopProductsColumn';
import useStickyActionBar from './hooks/useStickyActionBar';

type LoaderTypeProductDetail = {
	product: ProductDetail;
	canonical_url: string;
};

type LoaderErrorType = { error: any }

export const meta: MetaFunction = ({ data }: { data: LoaderTypeProductDetail }) => {
	if (!data) return { title: '404' };
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
		...FourOhFourLinks(),
		...ItemAddedModalLinks(),
		...QuantityPickerLinks(),
		...ProductDetailSectionLinks(),
		...ProductActionBarLinks(),
		...ProductActionBarLeftLinks(),
		...RecommendedProductsLinks(),
		...SocialShareLinks(),
		...RightTiltBoxLinks(),
		{ rel: "stylesheet", href: styles },
	];
};


const dynamicLinks: DynamicLinksFunction<LoaderTypeProductDetail> = ({ data }) => {
	return data
		? [
			{
				rel: 'canonical', href: data.canonical_url,
			},
		]
		: [];
}
export const handle = { dynamicLinks };

// Fetch product detail data.
export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const decompURL = decomposeProductDetailURL(url);

	if (!decompURL.variationUUID) {
		throw json<LoaderErrorType>(
			{ error: 'variationUUID is not found.' },
			{ status: httpStatus.NOT_FOUND },
		)
	}

	try {
		const prodDetail = await fetchProductDetail(decompURL.variationUUID)
		return json<LoaderTypeProductDetail>({
			product: prodDetail,
			canonical_url: `${getCanonicalDomain()}${url.pathname}`
		});
	} catch (error: any) {
		throw json<LoaderErrorType>(
			{ error },
			{ status: httpStatus.NOT_FOUND }
		);
	}
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
		return redirect(composeProductDetailURL({
			productName: formObj['productName'] as string,
			variationUUID: formObj['variationUUID'] as string,
		}));
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

export const CatchBoundary = () => (<FourOhFour />);

/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
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

	// User changes the variation.
	useEffect(() => {
		setProductDetail(data.product);
		if (!window) return;
		window.scrollTo(0, 0);
	}, [data.product.uuid]);

	useEffect(() => {
		const currentVariation = productDetail.variations.find(
			variation => productDetail.default_variation_uuid === variation.uuid
		)

		setVariation(currentVariation);
	}, [productDetail]);

	const [variationErr, setVariationErr] = useState<string>('');
	const [openSuccessModal, setOpenSuccessModal] = useState(false);

	const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
		if (!variation) return;
		const { purchase_limit } = variation;
		const newQuant = Number(evt.target.value);
		if (newQuant > purchase_limit) return;
		updateQuantity(newQuant);
	};

	const increaseQuantity = () => {
		if (!variation) return;
		const { purchase_limit } = variation;
		if (quantity === purchase_limit) return;
		updateQuantity(prev => prev + 1);
	};

	const decreaseQuantity = () => {
		if (quantity === 1) return;
		updateQuantity(prev => prev - 1);
	};

	const addToCart = useFetcher();
	const buyNow = useFetcher();
	const reloadCartItemCount = useFetcher();

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
			purchaseLimit: variation?.purchase_limit.toString() || '',
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

			reloadCartItemCount.submit(null, { action: '/components/Header?index' })
		}
	}, [addToCart.type])


	const handleClickProduct = (title: string, productUUID: string) => {
		console.log('ga[recommended_product]', title, productUUID);
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

			<Breadcrumbs
				categoryTitle={mainCategory.name}
				productTitle={productDetail.title}
				productUuid={productDetail.uuid}
			/>

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
									<div className="flex flex-col justify-start items-center w-full mt-3">
										<QuantityPicker
											value={quantity}
											onChange={handleUpdateQuantity}
											onIncrease={increaseQuantity}
											onDecrease={decreaseQuantity}
										/>

										<span className="w-full mt-2 text-[#757575] font-sm">
											Max {variation?.purchase_limit} pieces of this item on every purchase.
										</span>
									</div>

									<ProductActionBarLeft
										onClickAddToCart={handleAddToCart}
										onClickBuyNow={handleBuyNow}
										loading={addToCart.state !== 'idle'}
									/>
								</div>

								<Divider
									icon={<TbShare fontSize={20} />}
									text="share"
								/>

								<SocialShare />

								<div>
									<Divider
										icon={<TbTruckDelivery fontSize={24} />}
										text="delivery"
									/>

									<div className="flex px-3 justify-center items-center gap-1">
										<strong>
											{
												variation
													? `Lowest Shipping Cost At: £${variation?.shipping_fee}`
													: null
											}
										</strong>
									</div>
								</div>


								<div className="product-features-mobile">
									<Divider text="product features" />

									{/* TODO dangerous render html */}
									<div dangerouslySetInnerHTML={{ __html: productDetail?.description || '' }} className="product-features-container" />
								</div>

								<div>
									<Divider
										text="return policy"
										icon={<TbTruckReturn fontSize={24} />}
									/>

									<p className="text-center py-0 px-[10px]">
										14 days cancellation period applies.
									</p>
								</div>

								<div className="h-[100px] md:hidden">
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
					<div className="flex justify-center xl:justify-start">
						<RecommendedProducts
							category={mainCategory.name}
							onClickProduct={handleClickProduct}
						/>
					</div>
				</div>

				<div className="xl:w-[12rem] 1348:w-[15.875rem] hidden xl:block">
					<TopProductsColumn />
				</div>
			</div>

		</>
	);
};

export default ProductDetailPage;