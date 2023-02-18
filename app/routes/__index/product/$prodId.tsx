import {
	useCallback,
	useState,
	useEffect,
	useRef,
	useReducer,
} from 'react';
import type { ChangeEvent } from 'react';
import type { LoaderFunction, ActionFunction, MetaFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import Select from 'react-select';
import { TbTruckDelivery, TbTruckReturn } from 'react-icons/tb';
import Rating from '@mui/material/Rating';

import type { DynamicLinksFunction } from 'remix-utils';
import httpStatus from 'http-status-codes';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";

import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';
import ClientOnly from '~/components/ClientOnly';
import QuantityPicker, { links as QuantityPickerLinks } from '~/components/QuantityPicker';
import { commitSession } from '~/sessions/sessions';
import { insertItem } from '~/sessions/shoppingcart.session';
import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';
import ItemAddedModal, { links as ItemAddedModalLinks } from '~/components/PeasyDealMessageModal/ItemAddedModal';
import RightTiltBox, { links as RightTiltBoxLinks } from '~/components/Tags/RightTiltBox';
import {
	getCanonicalDomain,
	getProdDetailTitleText,
	getProdDetailDescText,
	getProdDetailDescTextWithoutPrice,
	getProdDetailFBSEO
} from '~/utils/seo';
import {
	decomposeProductDetailURL,
	composeProductDetailURL,
} from '~/utils';

import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from '@chakra-ui/react'

import Breadcrumbs from './components/Breadcrumbs';
import type { ProductDetail, ProductVariation } from './types';
import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar from './components/ProductActionBar';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import SocialShare, { links as SocialShareLinks } from './components/SocialShare';
import useStickyActionBar from './hooks/useStickyActionBar';
import useSticky from './hooks/useSticky';
import reducer, { ActionTypes } from './reducer';

type LoaderTypeProductDetail = {
	product: ProductDetail;
	canonical_url: string;
	meta_image: string;
};

type LoaderErrorType = { error: any }

export const meta: MetaFunction = ({ data }: { data: LoaderTypeProductDetail }) => {
	if (!data) return { title: '404' };
	const defaultVariation: ProductVariation | undefined = data.
		product.
		variations.
		find(variation => variation.uuid === data.product.default_variation_uuid);

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

		...getProdDetailFBSEO({
			title: getProdDetailTitleText(data.product.title, data.product.uuid),
			desc: description,
			image: data.meta_image,
			url: data.canonical_url,
		}),
	}
};

export const links: LinksFunction = () => {
	return [
		...FourOhFourLinks(),
		...ItemAddedModalLinks(),
		...QuantityPickerLinks(),
		...ProductDetailSectionLinks(),
		...RecommendedProductsLinks(),
		...SocialShareLinks(),
		...RightTiltBoxLinks(),
		{ rel: "stylesheet", href: styles },
	];
};


const dynamicLinks: DynamicLinksFunction<LoaderTypeProductDetail> = ({ data }) => {
	return [
		{ rel: 'canonical', href: data?.canonical_url || '' },
	];
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
			canonical_url: `${getCanonicalDomain()}${url.pathname}`,
			meta_image: prodDetail.images[0],
		});
	} catch (error: any) {
		throw json<LoaderErrorType>(
			{ error },
			{ status: httpStatus.NOT_FOUND }
		);
	}
};

type ActionType = 'to_product_detail' | 'add_item_to_cart' | 'buy_now';

// TODO
//  - [x] store shopping cart items in session storage if user has not logged in yet.
//  - [ ] what is error?
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formObj = Object.fromEntries(form.entries());
	const formAction = formObj['__action'] as ActionType;

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

type ProductDetailProps = {} & LazyComponentProps;
/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
 */
function ProductDetailPage({ scrollPosition }: ProductDetailProps) {
	const data = useLoaderData<LoaderTypeProductDetail>();
	const [state, dispatch] = useReducer(reducer, {
		productDetail: data.product,
		mainCategory: data.product.categories[0],
		images: data.product.images,
		quantity: 1,
		variation: data.product.variations.find(
			(variation: any) => data.product.default_variation_uuid === variation.uuid,
		),
	});

	const [variationErr, setVariationErr] = useState<string>('');
	const [openSuccessModal, setOpenSuccessModal] = useState(false);

	const productContentWrapperRef = useRef<HTMLDivElement>(null);
	const mobileUserActionBarRef = useRef<HTMLDivElement>(null);
	const productTopRef = useRef<HTMLDivElement>(null);
	useSticky(productContentWrapperRef, productTopRef, 'sticky', 145);
	useStickyActionBar(mobileUserActionBarRef, productContentWrapperRef);

	// Change product.
	useEffect(() => {
		// This action updates detail to new product also clears images of previous product images.
		dispatch({
			type: ActionTypes.change_product,
			payload: data.product,
		});

		// Update product images to new product after current event loop.
		setTimeout(() => {
			dispatch({
				type: ActionTypes.update_product_images,
				payload: data.product.images,
			});
		}, 0);

		if (!window) return;
		window.scrollTo(0, 0);
	}, [data.product.uuid]);

	useEffect(() => {
		const currentVariation = state.productDetail.variations.find(
			variation => state.productDetail.default_variation_uuid === variation.uuid
		)

		dispatch({
			type: ActionTypes.set_variation,
			payload: currentVariation,

		})

	}, [state.productDetail]);


	const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
		if (!state.variation) return;
		const { purchase_limit } = state.variation;
		const newQuant = Number(evt.target.value);
		if (newQuant > purchase_limit) return;
		dispatch({
			type: ActionTypes.update_quantity,
			payload: newQuant,
		})
	};

	const increaseQuantity = () => {
		if (!state.variation) return;
		const { purchase_limit } = state.variation;
		if (state.quantity === purchase_limit) return;

		dispatch({
			type: ActionTypes.update_quantity,
			payload: state.quantity + 1,
		})
	};

	const decreaseQuantity = () => {
		if (state.quantity === 1) return;
		dispatch({
			type: ActionTypes.update_quantity,
			payload: state.quantity - 1,
		})
	};

	const addToCart = useFetcher();
	const buyNow = useFetcher();
	const reloadCartItemCount = useFetcher();

	const extractProductInfo = useCallback(() => {
		// A product doesn't have any `spec_name` if the product has 1 variation only
		// other wise `Default Title` would appeared in `/cart`.
		const variation = state.variation;
		const specName = state.productDetail.variations.length === 1
			? ''
			: variation?.spec_name || ''

		return {
			salePrice: variation?.sale_price.toString() || '',
			retailPrice: variation?.retail_price.toString() || '',
			productUUID: state.productDetail.uuid,
			variationUUID: variation?.uuid || '',

			// product variation does not have "main_pic" yet, thus, we take the first product image to be displayed in shopping cart.
			image: state.productDetail.images[0] || '',
			quantity: state.quantity.toString(),
			title: state.productDetail?.title || '',
			specName: specName,
			purchaseLimit: variation?.purchase_limit.toString() || '',
		}
	}, [
		state.productDetail,
		state.quantity,
		state.variation,
	]);

	const handleAddToCart = () => {
		if (!state.variation) {
			setVariationErr('Please pick a variation');
			return;
		}
		setVariationErr('');

		const orderInfo = { ...extractProductInfo() };
		addToCart.submit(
			{
				__action: 'add_item_to_cart',
				...extractProductInfo(),
			} as ShoppingCartItem & { __action: ActionType },
			{ method: 'post', action: `/product/${orderInfo.productUUID}` },
		);
	};

	const handleBuyNow = () => {
		if (!state.variation) {
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

			reloadCartItemCount.submit(
				null,
				{
					method: 'post',
					action: '/components/Header?index',
					replace: true,
				})
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
				categoryLabel={state.mainCategory.label}
				categoryName={state.mainCategory.name}

				productTitle={state.productDetail.title}
				productUuid={state.productDetail.uuid}
			/>

			<div className="productdetail-container max-w-screen-xl mt-2 md:mt-6">
				<div className="ProductDetail__main-wrapper">
					<div className='ProductDetail__main-top' ref={productTopRef}>

						<ProductDetailSection
							description={state.productDetail?.description}
							pics={state.images}
							title={state.productDetail?.title}
						/>
						<div
							ref={productContentWrapperRef}
							className="
								rounded-md border-x border-b border-t-8 border-[#D02E7D]
								py-7 px-5
								w-full md:max-w-[44%]
								h-fit
								sticky
							"
						>
							<div className="absolute top-[-1.5rem] left-[-1px]">
								<RightTiltBox text={`${state.productDetail.order_count} bought`} />
							</div>

							<div className="product-content">
								<h1 className="text-xl md:text-2xl font-bold font-poppings mb-3">
									{state.productDetail?.title}
								</h1>

								{
									state.productDetail.num_of_raters > 0
										? (
											<div className="flex items-center mb-3">
												<Rating
													className="scale-75 translate-x-[-1.125rem]"
													name="product-rating"
													value={state.productDetail?.rating || 0}
													precision={0.1}
													readOnly
												/>

												<span className="text-sm translate-x-[-1.125rem]">
													{state.productDetail?.rating} ({state.productDetail.num_of_raters})
												</span>
											</div>
										)
										: null
								}

								<div className="flex items-center mb-4">
									<span className="text-4xl font-poppins font-bold text-[#D02E7D] mr-2">
										£{state.variation?.sale_price}
									</span>
									<span className='flex relative'>
										<span className="text-2xl">
											£{state.variation?.retail_price}
										</span>
										<span className='block w-full h-[3px] absolute top-[50%] bg-black' />
									</span>
								</div>

								<div className="flex justify-start items-center mb-4">
									<p
										className='
											flex items-center
											px-2 py-1 md:px-3
											text-[10px] md:text-[12px]
											rounded-[2px] md:rounded-[4px]
											text-white font-medium uppercase
											bg-[#D43B33]
										'
									>
										<b>
											{
												state.variation?.discount && (
													`${(Number(state.variation.discount) * 100).toFixed(0)} % off`
												)
											}
										</b>
									</p>
								</div>

								<small className="uppercase">
									<span className=""> availability: </span>
									<span className="text-[#D02E7D]" > in-stock </span>
								</small>

								<hr className='my-4' />

								<h3 className='text-xl font-bold'>
									Variations
								</h3>

								<div className="mt-5">
									<ClientOnly>
										{
											state.productDetail?.variations.length > 1
												? (
													<>
														<Select
															inputId='variation_id'
															instanceId='variation_id'
															placeholder='select variation'
															value={{
																value: state.variation?.uuid,
																label: state.variation?.spec_name,
															}}
															onChange={(v) => {
																if (!v) return;
																dispatch({
																	type: ActionTypes.set_variation,
																	payload: state.productDetail.variations.find(variation => variation.uuid === v.value),
																})
															}}
															options={
																state.productDetail.variations.map(
																	(variation) => ({ value: variation.uuid, label: variation.spec_name })
																)
															}
														/>

														{variationErr && <p className="error">{variationErr}</p>}
													</>
												)
												: null
										}
									</ClientOnly>

									{/* Quantity */}
									<div className="flex flex-col justify-start items-center w-full mt-3">
										<QuantityPicker
											value={state.quantity}
											onChange={handleUpdateQuantity}
											onIncrease={increaseQuantity}
											onDecrease={decreaseQuantity}
										/>

										<span className="w-full mt-2 text-[#757575] font-sm">
											Max {state.variation?.purchase_limit} pieces of this item on every purchase.
										</span>
									</div>

									<div className='hidden md:block'>
										<ProductActionBar
											onClickAddToCart={handleAddToCart}
											onClickBuyNow={handleBuyNow}
											loading={addToCart.state !== 'idle'}
										/>
									</div>

								</div>

								<hr className='my-4' />

								<div className='flex flex-col'>
									<p className='flex my-2'>
										<TbTruckDelivery fontSize={24} className="mr-2" />
										<span className='font-poppins'>
											{
												state.variation
													? <><b>£{`${state.variation?.shipping_fee}`}</b> Low Fixed Shipping Cost</>
													: null
											}
										</span>
									</p>

									<p className='flex my-2'>
										<TbTruckReturn fontSize={24} className="mr-2" />
										<span className='font-poppins'>
											<b>100% money back</b> guarantee
										</span>
									</p>
								</div>

								<div className="product-features-mobile">
									<Accordion className='flex md:hidden my-4' allowMultiple>
										<AccordionItem className="
											w-full max-w-[calc(100vw-2rem)]
											border-[#efefef]
										">
											<AccordionButton className=' px-0'>
												<h3 className='text-xl my-3 mr-auto'>About this product</h3>
												<AccordionIcon />
											</AccordionButton>

											<AccordionPanel pb={4} display="flex">
												<div className='w-full overflow-scroll'>
													<div dangerouslySetInnerHTML={{ __html: state.productDetail?.description || '' }} />
												</div>
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
								</div>

								<hr className='my-4 hidden md:block' />

								<div className="h-[100px] md:hidden">
									<ProductActionBar
										ref={mobileUserActionBarRef}
										onClickAddToCart={handleAddToCart}
										onClickBuyNow={handleBuyNow}
										loading={addToCart.state !== 'idle'}
									/>
								</div>

								<SocialShare prodUUID={state.productDetail.uuid} />
							</div>
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
				category={state.mainCategory.name}
				onClickProduct={handleClickProduct}
				scrollPosition={scrollPosition}
			/>
		</>
	);
};

export default trackWindowScroll(ProductDetailPage);
