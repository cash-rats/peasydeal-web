import { useEffect, useState, useRef, useReducer } from 'react';
import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher, useCatch } from '@remix-run/react';
import type { ShouldReloadFunction } from '@remix-run/react'
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import httpStatus from 'http-status-codes';
import { FcHighPriority } from 'react-icons/fc';
import { commitSession } from '~/sessions/redis_session';
import { getCart } from '~/sessions/shoppingcart.session';
import {
	setTransactionObject,
	resetTransactionObject,
} from '~/sessions/transaction.session';
import type { ShoppingCart } from '~/sessions/shoppingcart.session';
import LoadingBackdrop from '~/components/PeasyDealLoadingBackdrop';
import HorizontalProductsLayout, { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';
import FiveHundredError from '~/components/FiveHundreError';
import PaymentMethods from '~/components/PaymentMethods';

import cartReducer, { CartActionTypes } from './reducer';
import type { StateShape } from './reducer';
import CartItem, { links as ItemLinks } from './components/Item';
import RemoveItemModal from './components/RemoveItemModal';
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

type __action_type =
	| 'remove_cart_item'
	| 'update_item_quantity'
	| 'apply_promo_code';

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
	if (submission) {
		// Prevent `HorizontalProductsLayout` from triggering loader.
		if (submission.action.includes('/components/HorizontalProductsLayout')) {
			return false;
		}

		// Only allow `apply_promo_code` loader action to trigger loader.
		return submission.formData.get('__action') !== 'apply_promo_code';
	}

	return true;
}

// TODOs:
//   - [ ] handle prod_id is falsey value
//   - [ ] handle session key not exists
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formEntries = Object.fromEntries(form.entries());
	const actionType = formEntries['__action'] as __action_type;

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
		const priceInfo = await fetchPriceInfo({
			products: convertShoppingCartToPriceQuery(cart),
		});

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

type PreviousQuantity = {
	[key: string]: string;
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
	const preloadData = useLoaderData<LoaderType>();
	const [state, dispatch] = useReducer(
		cartReducer,
		{
			cartItems: preloadData.cart,
			priceInfo: preloadData.priceInfo,
		} as StateShape,
	);

	const [prevQuantity, setPrevQuantity] = useState<PreviousQuantity>({});
	const [syncingPrice, setSyncingPrice] = useState(false);
	const [openRemoveItemModal, setOpenRemoveItemModal] = useState(false);
	const [promoCode, setPromoCode] = useState('');

	const removeItemFetcher = useFetcher();
	const updateItemQuantityFetcher = useFetcher();
	const applyPromoCodeFetcher = useFetcher();
	const cartItemCountFetcher = useFetcher();

	const targetRemovalVariationUUID = useRef<null | string>(null);
	const justSynced = useRef<boolean>(false);

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
			setPromoCode(data.discount_code);
			dispatch({
				type: CartActionTypes.set_price_info,
				payload: data.price_info,
			});
		}
	}, [applyPromoCodeFetcher.type]);

	const handleOnBlurQuantity = (evt: FocusEvent<HTMLInputElement>, variationUUID: string, quantity: number) => {
		if (quantity === 0) {
			targetRemovalVariationUUID.current = variationUUID;
			setOpenRemoveItemModal(true);
			return;
		}

		// We don't need to sync quantity if user has not changed anything.
		if (prevQuantity[variationUUID] && Number(prevQuantity[variationUUID]) === quantity) return;


		// Update item quantity in session && recalculate price info from BE.
		if (justSynced.current) {
			justSynced.current = false;

			return;
		}

		updateQuantity(variationUUID, quantity);
		setSyncingPrice(true);

		updateItemQuantityFetcher.submit(
			{
				__action: 'update_item_quantity',
				variation_uuid: variationUUID,
				quantity: quantity.toString(),
				promo_code: promoCode,
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		);
	};

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
				promo_code: promoCode,
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		)
	}

	const handleRemoveItemResult = (res: boolean) => {
		if (!res) return false;
		if (!targetRemovalVariationUUID.current) return;

		// Remove cart item on the client side before mutating session.
		removeItem(targetRemovalVariationUUID.current);

		setOpenRemoveItemModal(false);
	}

	const handleCancelRemoval = () => {
		// User decide not to cancel, revert cartitem in session.
		if (!targetRemovalVariationUUID || !targetRemovalVariationUUID.current) return;
		const variationUUID = targetRemovalVariationUUID.current;
		dispatch({
			type: CartActionTypes.update_cart_item,
			payload: {
				variationUUID,
				quantity: prevQuantity[variationUUID]
			},
		});

		setOpenRemoveItemModal(false);
	}

	const handleOnChangeQuantity = (evt: ChangeEvent<HTMLInputElement>, variationUUID: string, quantity: number) => {
		if (isNaN(quantity)) return;
		updateQuantity(variationUUID, quantity);
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
				promo_code: promoCode,
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		);

		justSynced.current = true;
	}

	const updateQuantity = (variationUUID: string, number: number) => {
		setPrevQuantity(prev => ({
			...prev,
			[variationUUID]: state.cartItems[variationUUID].quantity,
		}));

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

	if (
		Object.keys(state.cartItems).length === 0 ||
		state.priceInfo === null
	) {
		return (
			<EmptyShoppingCart />
		);
	}

	console.log(state.priceInfo);

	return (
		<>
			<LoadingBackdrop open={syncingPrice} />

			<RemoveItemModal
				open={openRemoveItemModal}
				itemName="some item"
				onClose={handleCancelRemoval}
				onResult={handleRemoveItemResult}
			/>

			<section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				mx-2 md:mx-4
				mb-8
				bg-[#F7F8FA]
			">
				{
					state.priceInfo && state.priceInfo?.total_amount < FREE_SHIPPING
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
									{` Spend £${round10(FREE_SHIPPING - state.priceInfo?.total_amount, -2)} more to get free shipping`}
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
												)

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
														discountReason: item.discountReason,
													}}
													calculating={isCalculating}
													onClickQuantity={(evt, number) => handleOnClickQuantity(evt, variationUUID, number)}
													onChangeQuantity={(evt, number) => handleOnChangeQuantity(evt, variationUUID, number)}
													onBlurQuantity={(evt, number) => handleOnBlurQuantity(evt, variationUUID, number)}
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
											appliedPromoCode={promoCode}
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
						catID={1}
						title='top items'
						seeAllLinkTo='/Hot Deal'
					/>

					{/* Recommended products - new trend */}
					{/* @TODO catID should not be hardcoded here */}
					<HorizontalProductsLayout
						catID={2}
						title='new trend'
						seeAllLinkTo='/New Trend'
					/>
				</div>
			</section>
		</>
	);
}

export default Cart;