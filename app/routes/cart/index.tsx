import { useEffect, useState, useReducer, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher, useCatch } from '@remix-run/react';
import type { ShouldRevalidateFunction } from "@remix-run/react";
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import httpStatus from 'http-status-codes';
import { FcHighPriority } from 'react-icons/fc';
import { commitSession } from '~/sessions/redis_session';
import { getCart } from '~/sessions/shoppingcart.session';
import {
	setTransactionObject,
	resetTransactionObject,
} from '~/sessions/transaction.session';
import { insertItem } from '~/sessions/shoppingcart.session';
import type { ShoppingCart } from '~/sessions/shoppingcart.session';
import LoadingBackdrop from '~/components/PeasyDealLoadingBackdrop';
import HorizontalProductsLayout, { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';
import FiveHundredError from '~/components/FiveHundreError';
import PaymentMethods from '~/components/PaymentMethods';

import cartReducer, { CartActionTypes } from './reducer';
import type { StateShape } from './reducer';
import CartItem, { links as ItemLinks } from './components/Item';
import EmptyShoppingCart, { links as EmptyShippingCartLinks } from './components/EmptyShoppingCart';
import PriceResult from './components/PriceResult';
import {
	fetchPriceInfo,
	convertShoppingCartToPriceQuery,
} from './cart.server';
import type { PriceInfo } from './cart.server';
import styles from './styles/cart.css';
import sslCheckout from './images/SSL-Secure-Connection.png';
import {
	applyPromoCode,
	removeCartItemAction,
	updateItemQuantity,
} from './actions';
import type { ActionType } from './actions';
import type { RemoveCartItemActionDataType, ApplyPromoCodeActionType } from './actions';
import { syncShoppingCartWithNewProductsInfo, extractPriceInfoToStoreInSession } from './utils';
import { round10 } from '~/utils/preciseRound';

export const links: LinksFunction = () => {
	return [
		...ItemLinks(),
		...EmptyShippingCartLinks(),
		...HorizontalProductsLayoutLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

const FREE_SHIPPING = 19.99;

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction, formData }) => {
	if (
		formAction &&
		formAction.includes('/components/HorizontalProductsLayout')
	) {
		return false
	}

	if (formData) {
		const action = formData.get('__action');

		if (
			action === 'apply_promo_code' ||
			action === 'update_item_quantity' ||
			action === 'remove_cart_item'
		) {
			return false;
		}
	}

	return true
}

// TODOs:
//   - [ ] handle prod_id is falsey value
//   - [ ] handle session key not exists
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formEntries = Object.fromEntries(form.entries());
	const actionType = formEntries['__action'] as ActionType;

	if (actionType === 'remove_cart_item') {
		const variationUUID = formEntries['variation_uuid'] as string || '';
		const promoCode = formEntries['promo_code'] as string || '';
		return removeCartItemAction(variationUUID, promoCode, request);
	}

	if (actionType === 'update_item_quantity') {
		const variationUUID = formEntries['variation_uuid'] as string || '';
		const quantity = formEntries['quantity'] as string;
		const promoCode = formEntries['promo_code'] as string || '';
		return updateItemQuantity(request, variationUUID, quantity, promoCode);
	}

	if (actionType === 'apply_promo_code') {
		const promoCode = formEntries['promo_code'] as string;
		return applyPromoCode(request, promoCode);
	}

	if (actionType === 'buy_now') {
		const serializedCartItem = formEntries['cart_item'] as string;
		const cartItem = JSON.parse(serializedCartItem);

		return redirect(
			'/cart',
			{
				headers: {
					"Set-Cookie": await commitSession(
						await insertItem(request, cartItem)
					),
				},
			},
		);
	}

	// Unknown action
	throw new Error(`unrecognized cart action type: ${actionType}`);
}

type LoaderType = {
	cart: ShoppingCart | {};
	priceInfo: PriceInfo | null;
};

/*
 * Fetch cart items from product list when user is not logged in.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// If cart contains no items, display empty cart page via CatchBoundary
	const cart = await getCart(request);

	if (!cart || Object.keys(cart).length === 0) {
		// Reset transaction object if we have an empty cart.
		throw json(
			'Shopping cart empty',
			{
				status: httpStatus.NOT_FOUND,
				headers: {
					'Set-Cookie': await commitSession(
						await resetTransactionObject(request),
					),
				}
			});
	}

	try {
		console.log('debug cart 1', convertShoppingCartToPriceQuery(cart));

		const priceInfo = await fetchPriceInfo({
			products: convertShoppingCartToPriceQuery(cart),
		});

		console.log('debug cart 2', priceInfo);

		const sessionStorablePriceInfo = extractPriceInfoToStoreInSession(priceInfo);
		const session = await setTransactionObject(request, {
			promo_code: null, // Reset promo_code everytime user refreshes.
			price_info: sessionStorablePriceInfo,
		})

		return json<LoaderType>({
			cart: syncShoppingCartWithNewProductsInfo(cart, priceInfo.products),
			priceInfo,
		}, {
			headers: {
				'Set-Cookie': await commitSession(session),
			}
		});
	} catch (err) {
		throw json(err, {
			status: httpStatus.INTERNAL_SERVER_ERROR,
		});
	}
};

export const CatchBoundary = () => {
	const caught = useCatch();

	if (caught.status === httpStatus.NOT_FOUND) {
		return (<EmptyShoppingCart />);
	}

	return (
		<FiveHundredError
			message={caught.data}
			statusCode={caught.status}
		/>
	);
}

/*
 * Coppy shopee's layout
 * @see https://codepen.io/justinklemm/pen/kyMjjv
 *
 * container width: max-width: 1180px;
 *
 * - [x] show empty shopping cart when no item existed yet, empty shipping cart should be a component instead of a route.
 * - [x] Add `~~$99.98 Now $49.99 You Saved $50` text.
 * - [x] When quantity is deducted to 0, popup a notification that the item is going to be removed.
 * - [x] Checkout flow.
 * - [ ] 重複點擊同個 quantity 會 重新 calculate price。
 * - [ ] use useReducer to cleanup useState
 */
function Cart() {
	const preloadData = useLoaderData<LoaderType>() || {};
	const [state, dispatch] = useReducer(
		cartReducer,
		{
			cartItems: preloadData?.cart,
			priceInfo: preloadData?.priceInfo,
			promoCode: '',
		} as StateShape,
	);

	const [syncingPrice, setSyncingPrice] = useState(false);

	const removeItemFetcher = useFetcher();
	const updateItemQuantityFetcher = useFetcher();
	const applyPromoCodeFetcher = useFetcher();
	const cartItemCountFetcher = useFetcher();

	// Scroll to top when cart page rendered.
	useEffect(() => {
		if (!window) return;
		window.scrollTo(0, 0);
	}, [])

	// If cart item contains no item, we simply redirect user to `/cart` so that
	// corresponding loader can display empty cart page to user.
	useEffect(() => {
		if (removeItemFetcher.type === 'done') {
			const { price_info } = removeItemFetcher.data as RemoveCartItemActionDataType;
			setSyncingPrice(false);

			dispatch({
				type: CartActionTypes.set_price_info,
				payload: price_info
			});

			cartItemCountFetcher.submit(
				null,
				{
					method: 'post',
					action: '/components/Header?index',
					replace: true,
				},
			)
		}
	}, [removeItemFetcher.type]);

	// When user update the quantity, we need to update the cost info calced by backend as well.
	useEffect(() => {
		if (updateItemQuantityFetcher.type === 'done') {
			const data = updateItemQuantityFetcher.data as PriceInfo;
			if (!data) return;
			dispatch({
				type: CartActionTypes.set_price_info,
				payload: data,
			});
			setSyncingPrice(false);
		}
	}, [updateItemQuantityFetcher.type]);

	// Update the resulting price info to display when user applied promo code.
	useEffect(() => {
		if (applyPromoCodeFetcher.type === 'done') {
			const data = applyPromoCodeFetcher.data as ApplyPromoCodeActionType

			dispatch({
				type: CartActionTypes.set_promo_code,
				payload: data.discount_code,
			});

			// setPromoCode(data.discount_code);
			dispatch({
				type: CartActionTypes.set_price_info,
				payload: data.price_info,
			});
		}
	}, [applyPromoCodeFetcher.type]);


	const removeItem = (targetRemovalVariationUUID: string) => {
		// Update cart state with a version without removed item.
		setSyncingPrice(true);

		dispatch({
			type: CartActionTypes.remove_cart_item,
			payload: targetRemovalVariationUUID,
		});

		// Remove item in session.
		removeItemFetcher.submit(
			{
				__action: 'remove_cart_item',
				variation_uuid: targetRemovalVariationUUID,
				promo_code: state.promoCode,
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		)
	}

	const handleOnClickQuantity = (evt: MouseEvent<HTMLLIElement>, variationUUID: string, number: number) => {
		// If user hasn't changed anything. don't bother to update the quantity.
		if (
			state.cartItems[variationUUID] &&
			Number(state.cartItems[variationUUID].quantity) === number
		) return;
		updateQuantity(variationUUID, number);
		setSyncingPrice(true);

		updateItemQuantityFetcher.submit(
			{
				__action: 'update_item_quantity',
				variation_uuid: variationUUID,
				quantity: number.toString(),
				promo_code: state.promoCode,
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		);
	}

	const updateQuantity = (variationUUID: string, number: number) => {
		dispatch({
			type: CartActionTypes.update_cart_item,
			payload: {
				variationUUID,
				quantity: number.toString(),
			},
		});
	}

	const handleRemove = (evt: MouseEvent<HTMLButtonElement>, variationUUID: string) =>
		removeItem(variationUUID);


	const handleClickApplyPromoCode = (code: string) => {
		applyPromoCodeFetcher.submit(
			{
				__action: 'apply_promo_code',
				promo_code: code,
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		);
	};


	const freeshippingRequiredPrice = useMemo(() => {
		if (!state.priceInfo) return 0;

		const _vatPrice = state.priceInfo?.sub_total + state.priceInfo?.tax_amount;
		const _freeshippingRequiredPrice = FREE_SHIPPING - _vatPrice;

		return _freeshippingRequiredPrice;
	}, [state.priceInfo]);


	if (
		Object.keys(state.cartItems).length === 0 ||
		state.priceInfo === null
	) {
		return (
			<EmptyShoppingCart />
		);
	}

	return (
		<>
			<LoadingBackdrop open={syncingPrice} />

			<section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				mt-4 md:mt-8
				mx-2 md:mx-4
				mb-8
				bg-[#F7F8FA]
			">
				{
					freeshippingRequiredPrice > 0
						? (
							<div className="
								w-full py-2.5 max-w-screen-xl mx-auto
								capitalized
								text-lg font-poppins nowrap
								flex
								items-center
								bg-white
								p-4
								rounded-lg border-[2px] border-[#fc1d7a]
							">
								<FcHighPriority fontSize={24} className='w-[36px] mr-4' />
								<span>
									<b className='text-[#fc1d7a] font-poppins font-bold'>Wait!</b>
									{` Spend £${round10(freeshippingRequiredPrice, -2)} more to get free shipping`}
								</span>
							</div>
						) : null
				}
				<div className="w-full py-2.5 max-w-screen-xl mx-auto">
					<div className="flex flex-col">
						<h1 className="
							font-poppins font-semibold
							text-xl md:text-3xl
							mt-6 md:mt-8
							mb-2 md:mb-3
							flex
							items-center
							relative
						">
							<span>Shopping Cart</span>
							<div className="block w-[1px] h-[25px] bg-[#757575] mx-2 md:mx-4" />
							<span className="
								items-center
								font-poppins font-normal
								text-xl md:text-2xl
							">
								{
									Object.keys(state.cartItems).length > 0 && (
										<>
											{Object.keys(state.cartItems).length} {Object.keys(state.cartItems).length > 1 ? 'items' : 'item'}
										</>
									)
								}
							</span>
							<img
								src={sslCheckout}
								alt="secure checkout with SSL protection"
								className='h-[42px] md:h-[48px] ml-auto right-0 absolute'
							/>
						</h1>

						{/* title row */}
						<div className='flex flex-col md:grid grid-cols-3 gap-4 mt-2 md:mt-6'>
							<div className='col-span-2'>
								<div className="
									w-full h-height
									capitalized
									text-lg font-poppins nowrap
									ml-auto items-center
									bg-white
									p-4
									hidden md:grid grid-cols-12 gap-4
								">
									<span className="col-span-6 font-medium">
										Item
									</span>

									<span className="col-span-2 text-right font-medium">
										Price
									</span>

									<span className="col-span-2 text-right font-medium">
										Quantity
									</span>

									<span className="col-span-2 text-right font-medium">
										Total
									</span>

								</div>
								{
									// TODO: add typescript to item.
									Object.
										keys(state.cartItems).
										map((prodID) => {
											const item = state.cartItems[prodID];
											const variationUUID = item.variationUUID;

											const isCalculating = (
												updateItemQuantityFetcher.state !== 'idle' &&
												updateItemQuantityFetcher.submission?.formData.get('variation_uuid') === variationUUID

											) || (
													removeItemFetcher.state !== 'idle' &&
													removeItemFetcher.submission?.formData.get('variation_uuid') === variationUUID
												);

											return (
												<CartItem
													key={variationUUID}
													item={{
														productUUID: item.productUUID,
														variationUUID,
														image: item.image,
														title: item.title,
														description: item.specName,
														salePrice: Number(item.salePrice),
														retailPrice: Number(item.retailPrice),
														quantity: Number(item.quantity),
														purchaseLimit: Number(item.purchaseLimit),
														tagComboTags: item.tagComboTags,
														discountReason: item.discountReason,
													}}
													calculating={isCalculating}
													onClickQuantity={(evt, number) => handleOnClickQuantity(evt, variationUUID, number)}
													onClickRemove={handleRemove}
												/>

											)
										})
								}
							</div>

							<div className='flex flex-col'>
								{
									state.priceInfo && (
										<PriceResult
											onApplyPromoCode={handleClickApplyPromoCode}
											appliedPromoCode={state.promoCode}
											priceInfo={state.priceInfo}
											calculating={
												updateItemQuantityFetcher.state !== 'idle' ||
												removeItemFetcher.state !== 'idle' ||
												applyPromoCodeFetcher.state !== 'idle'
											}
										/>
									)
								}
								<div className='bg-white p-4 mt-4 gap-4'>
									<h3 className='text-center font-bold'>100% Secure Payment with</h3>
									<PaymentMethods />
								</div>
							</div>
						</div>

					</div>
				</div>
			</section>

			<section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				px-2 md:px-4
				bg-white
			">
				<div className="w-full py-2.5 max-w-screen-xl mx-auto">

					{/* Recommended products - top items */}
					{/* @TODO catID should not be hardcoded here */}
					<HorizontalProductsLayout
						catName='hot_deal'
						title='top items'
						seeAllLinkTo='/promotion/hot_deal'
					/>

					{/* Recommended products - new trend */}
					{/* @TODO catID should not be hardcoded here */}
					<HorizontalProductsLayout
						catName='new_trend'
						title='new trend'
						seeAllLinkTo='/promotion/new_trend'
					/>
				</div>
			</section>
		</>
	);
}

export default Cart;