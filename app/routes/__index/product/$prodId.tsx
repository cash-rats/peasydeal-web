import {
	useCallback,
	useState,
	useEffect,
	useRef,
	useReducer,
	useMemo,
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

import { BsLightningCharge } from 'react-icons/bs';

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
	getProdDetailOgSEO,
	getFourOhFourTitleText,
	getFourOhFourDescText,
} from '~/utils/seo';
import {
	decomposeProductDetailURL,
	composeProductDetailURL,
} from '~/utils';
import { round10 } from '~/utils/preciseRound';

import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Tag,
	TagLeftIcon
} from '@chakra-ui/react'
import extra10 from '~/images/extra10.png';

import Breadcrumbs from './components/Breadcrumbs';
import type { ProductVariation, LoaderTypeProductDetail } from './types';
import ProductDetailSection, { links as ProductDetailSectionLinks } from './components/ProductDetailSection';
import { fetchProductDetail } from './api';
import styles from "./styles/ProdDetail.css";
import ProductActionBar from './components/ProductActionBar';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import SocialShare, { links as SocialShareLinks } from './components/SocialShare';
import useStickyActionBar from './hooks/useStickyActionBar';
import useSticky from './hooks/useSticky';
import reducer, { ActionTypes } from './reducer';
import { structuredData } from './structured_data';
import { normalizeToSessionStorableCartItem, findDefaultVariation } from './utils';

type LoaderErrorType = { error: any }

const SUPER_DEAL_OFF = 0.9;

export const meta: MetaFunction = ({ data }: { data: LoaderTypeProductDetail }) => {
	if (!data || !data.product) {
		return {
			title: getFourOhFourTitleText('product'),
			description: getFourOhFourDescText('product'),
		};
	}

	const defaultVariation: ProductVariation | undefined = data.
		product.
		variations.
		find(variation => variation.uuid === data.product.default_variation_uuid);

	const category = data.product?.categories.length > 0 ? data.product.categories[0].label : '';
	let description = getProdDetailDescTextWithoutPrice(data.product.title, category);

	if (defaultVariation) {
		description = getProdDetailDescText(
			data.product.title,
			defaultVariation.retail_price,
			defaultVariation.sale_price,
			category,
		)
	}

	return {
		title: getProdDetailTitleText(data.product.title, data.product.uuid),
		description,

		...getProdDetailOgSEO({
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
		{
			rel: 'canonical',
			href: data?.canonical_url || getCanonicalDomain(),
		},
	];
}

export const handle = {
	dynamicLinks,
	structuredData,
};

// Fetch product detail data.
export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const decompURL = decomposeProductDetailURL(url);

	if (!decompURL.productUUID) {
		throw json<LoaderErrorType>(
			{ error: 'variationUUID is not found.' },
			{ status: httpStatus.NOT_FOUND },
		)
	}

	try {
		const prodDetail = await fetchProductDetail(decompURL.productUUID)
		console.log('debug prodDetail', prodDetail.categories);
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

type ActionType =
	| 'to_product_detail'
	| 'add_item_to_cart'
	| 'buy_now';

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
			productUUID: formObj['productUUID'] as string,
		}));
	}

	const cartObj = Object.fromEntries(form.entries()) as ShoppingCartItem;

	// If item does not have a valid productUUID, don't insert it to shopping cart.
	if (
		!cartObj ||
		!cartObj.variationUUID ||
		typeof cartObj.variationUUID === 'undefined'
	) {
		return json('');
	}

	const session = await insertItem(request, cartObj);

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

const getPriceRow = (salePrice: number, previousRetailPrice: Array<number>) => {
	return (
		<>
			<span className="text-4xl font-poppins font-bold text-[#D02E7D] mr-2">
				£{salePrice}
			</span>
			{
				previousRetailPrice.length > 0 && previousRetailPrice.map((retailPrice, index) => (
					<span
						className='flex relative mr-2'
						key={`previous_retail_price${index}`}
						style={{ fontWeight: index === 0 && previousRetailPrice.length !== 1 ? '500' : '300' }}
					>
						<span className="text-2xl">
							£{retailPrice}
						</span>
						<span className='block w-full h-[3px] absolute top-[50%] bg-black' />
					</span>
				))
			}
		</>
	)
}

type ProductDetailProps = {} & LazyComponentProps;
/*
 * Emulate discount expert
 * @see https://www.discountexperts.com/deal/uptfll2cfs/Breathable_Air_Cushion_Trainers___6_Colours___Sizes
 */
function ProductDetailPage({ scrollPosition }: ProductDetailProps) {
	const loaderData = useLoaderData<LoaderTypeProductDetail>();
	const mainCategory = (
		loaderData.product.categories &&
		loaderData.product.categories.length > 0
	)
		? loaderData.product.categories[0]
		: null;

	const defaultVariation = findDefaultVariation(loaderData.product);

	const [state, dispatch] = useReducer(reducer, {
		productDetail: loaderData.product,
		categories: loaderData.product.categories,
		mainCategory,
		images: loaderData.product.images,
		quantity: 1,
		variation: defaultVariation,
		sessionStorableCartItem: normalizeToSessionStorableCartItem(
			{
				productDetail: loaderData.product,
				productVariation: defaultVariation,
				quantity: 1,
			},
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
			payload: loaderData.product,
		});

		// Update product images to new product after current event loop.
		setTimeout(() => {
			dispatch({
				type: ActionTypes.update_product_images,
				payload: loaderData.product.images,
			});
		}, 100);

		if (!window) return;
		window.scrollTo(0, 0);
	}, [loaderData.product.uuid]);

	useEffect(() => {
		const currentVariation = findDefaultVariation(state.productDetail);

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
	const reloadCartItemCount = useFetcher();

	const handleAddToCart = useCallback(
		() => {
			if (!state.variation) {
				setVariationErr('Please pick a variation');
				return;
			}

			setVariationErr('');

			const payload = {
				__action: 'add_item_to_cart',
				...state.sessionStorableCartItem
			} as ShoppingCartItem & { __action: ActionType };

			addToCart.submit(
				payload,
				{
					method: 'post',
					action: `/product/${payload.productUUID}`,
				},
			);
		},
		[state.sessionStorableCartItem],
	);

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
	}, [addToCart.type]);

	const hasSuperDeal = useMemo(function () {
		const { categories } = state.productDetail || {}
		let _hasSuperDeal = false;

		categories.forEach(({ name }) => {
			if (name === 'super_deal') {
				_hasSuperDeal = true;
			}
		});

		return _hasSuperDeal;
	}, [state.productDetail]);

	const PriceRowMemo = useMemo(() => {
		if (!state.variation?.sale_price) return null;
		if (!state.variation?.retail_price) return getPriceRow(state.variation?.sale_price, []);

		const salePrice = state.variation?.sale_price;
		const retailPrice = state.variation?.retail_price;

		return hasSuperDeal
			? getPriceRow(round10(salePrice * SUPER_DEAL_OFF, -2), [salePrice, retailPrice])
			: getPriceRow(salePrice, [retailPrice])
	}, [state.variation, hasSuperDeal]);

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
				categories={state.categories}

				productTitle={state.productDetail.title}
				productUuid={state.productDetail.uuid}
			/>

			<div className="productdetail-container max-w-screen-xl mt-2 md:mt-6">
				<div className="">
					<div className='ProductDetail__main-top flex lg:grid grid-cols-10' ref={productTopRef}>
						<div className='col-span-5 xl:col-span-6'>
							<ProductDetailSection
								description={state.productDetail?.description}
								pics={state.images}
								title={state.productDetail?.title}
							/>
						</div>
						<div
							ref={productContentWrapperRef}
							className="
								rounded-md border-x border-b border-t-8 border-[#D02E7D]
								py-7 px-5
								w-full
								h-fit
								sticky
								col-span-5 xl:col-span-4
							"
						>
							{
								hasSuperDeal && (
									<img
										alt='extra 10% off - super deal'
										className='
											absolute
											right-[-20px] md:right-[-36px]
											top-[-45px] md:top-[-43px]
											scale-[0.85]
										'
										src={extra10}
									/>
								)
							}
							<div className="absolute top-[-1.5rem] left-[-1px]">
								<RightTiltBox text={`${state.productDetail.order_count} bought`} />
							</div>

							<div className="product-content">
								{
									hasSuperDeal && (
										<Tag
											colorScheme="cyan"
											variant='solid'
											className="nowrap mb-2"
											size='md'
										>
											<TagLeftIcon boxSize='16px' as={BsLightningCharge} />
											<span>SUPER DEAL</span>
										</Tag>
									)
								}

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
									{PriceRowMemo}
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
											sessionStorableCartItem={state.sessionStorableCartItem}
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
													? <>Shipping starting from <b>£{`${state.variation?.shipping_fee}`}</b></>
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
										sessionStorableCartItem={state.sessionStorableCartItem}
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
			{
				state.mainCategory
					? (
						<RecommendedProducts
							category={state.mainCategory.name}
							onClickProduct={handleClickProduct}
							scrollPosition={scrollPosition}
						/>

					)
					: null
			}
		</>
	);
};

export default trackWindowScroll(ProductDetailPage);
