import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import type { LinksFunction, LoaderFunction, ActionFunction, } from '@remix-run/node';
import { BsBagCheck } from 'react-icons/bs';

import RoundButton, { links as RoundButtonLinks } from '~/components/RoundButton';
import { commitSession } from '~/sessions/redis_session';
import { getCart, removeItem, updateCart } from '~/utils/shoppingcart.session';
import type { ShoppingCart } from '~/utils/shoppingcart.session';
// TODO: all script in this file should be removed.
import { TAX } from '~/utils/checkout_accountant';
import LoadingBackdrop from '~/components/PeasyDealLoadingBackdrop';
import HorizontalProductsLayout, { links as HorizontalProductsLayoutLinks } from '~/routes/components/HorizontalProductsLayout';

import CartItem, { links as ItemLinks } from './components/Item';
import RemoveItemModal from './components/RemoveItemModal';
import EmptyShoppingCart, { links as EmptyShippingCartLinks } from './components/EmptyShoppingCart';
import { fetchPriceInfo, convertShoppingCartToPriceQuery } from './cart.server';
import type { PriceInfo } from './cart.server';
import styles from './styles/cart.css';

export const links: LinksFunction = () => {
	return [
		...RoundButtonLinks(),
		...ItemLinks(),
		...EmptyShippingCartLinks(),
		...HorizontalProductsLayoutLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

type __action_type =
	| 'remove_cart_item'
	| 'update_item_quantity';


const __removeCartItemAction = async (variationUUID: string, request: Request) => {
	const session = await removeItem(request, variationUUID);
	const cart = session.get('shopping_cart');

	// Recalc price info.
	const priceQuery = convertShoppingCartToPriceQuery(cart);
	const priceInfo = await fetchPriceInfo({ products: priceQuery });

	let itemCount = 0;

	if (cart && Object.keys(cart).length > 0) {
		itemCount = Object.keys(cart).length
	}

	// `cart_item_count` tells frontend when to perform page refresh. When `cart_item_count`
	// equals 0, frontend will trigger load of the current route which displays empty bag page.
	return json(
		{
			cart_item_count: itemCount,
			price_info: priceInfo,
		},
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		});
}

const __updateItemQuantity = async (variationUUID: string, quantity: string, request: Request) => {
	// Recalc price info
	const cart = await getCart(request);
	if (!cart || Object.keys(cart).length === 0) return null;
	const item = cart[variationUUID]
	if (!item) return null;
	item.quantity = quantity;

	const priceQuery = convertShoppingCartToPriceQuery(cart);
	const priceInfo = await fetchPriceInfo({ products: priceQuery });

	const session = await updateCart(request, cart);

	return new Response(JSON.stringify(priceInfo), {
		headers: {
			"Set-Cookie": await commitSession(session),
		}
	});
}

// TODOs:
//   - [ ] handle prod_id is falsey value
//   - [ ] handle session key not exists
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formEntries = Object.fromEntries(form.entries());
	const actionType = formEntries['__action'] as __action_type || 'remove_cart_item'

	if (actionType === 'remove_cart_item') {
		const variationUUID = formEntries['variation_uuid'] as string || '';
		return await __removeCartItemAction(variationUUID, request);
	}

	if (actionType === 'update_item_quantity') {
		const variationUUID = formEntries['variation_uuid'] as string || '';
		console.log('debug ~update_item_quantity', variationUUID);
		const quantity = formEntries['quantity'] as string;
		return __updateItemQuantity(variationUUID, quantity, request);
	}

	// Unknown action
	return null;
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
		return json<LoaderType>({
			cart: {},
			priceInfo: null,
		});
	}

	const costQuery = convertShoppingCartToPriceQuery(cart);
	const priceInfo = await fetchPriceInfo({ products: costQuery });

	return json<LoaderType>({ cart, priceInfo });
};

export const CatchBoundary = () => {
	return (<EmptyShoppingCart />);
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
 * - [ ] Add `~~$99.98 Now $49.99 You Saved $50` text.
 * - [x] When quantity is deducted to 0, popup a notification that the item is going to be removed.
 * - [x] Checkout flow.
 */
function Cart() {
	const preloadData = useLoaderData<LoaderType>();
	const [cartItems, setCartItems] = useState<ShoppingCart>(preloadData.cart);
	const [prevQuantity, setPrevQuantity] = useState<PreviousQuantity>({});
	const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(preloadData.priceInfo);
	const [syncingPrice, setSyncingPrice] = useState(false);

	const [openRemoveItemModal, setOpenRemoveItemModal] = useState(false);

	const removeItemFetcher = useFetcher();
	const updateItemQuantityFetcher = useFetcher();

	const targetRemovalVariationUUID = useRef<null | string>(null);
	const justSynced = useRef<boolean>(false);

	// If cart item contains no item, we simply redirect user to `/cart` so that
	// corresponding loader can display empty cart page to user.
	useEffect(() => {
		if (removeItemFetcher.type === 'done') {
			const { price_info } = removeItemFetcher.data;
			setPriceInfo(price_info);
			setSyncingPrice(false);
		}
	}, [removeItemFetcher]);

	// When user update the quantity, we need to update the cost info calced by backend as well.
	useEffect(() => {
		if (updateItemQuantityFetcher.type === 'done') {
			const data = updateItemQuantityFetcher.data as string | null;
			if (!data) return;
			const priceInfo = JSON.parse(data);
			setPriceInfo(priceInfo);
			setSyncingPrice(false);
		}
	}, [updateItemQuantityFetcher]);

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
				quantity: quantity.toString()
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		);
	};

	const removeItem = (targetRemovalVariationUUID: string) => {
		const updatedCartItems = Object.keys(cartItems).reduce((newCartItems: ShoppingCart, variationUUID) => {
			if (variationUUID === targetRemovalVariationUUID) return newCartItems;
			newCartItems[variationUUID] = cartItems[variationUUID];
			return newCartItems
		}, {})

		// Update cart state with a version without removed item.
		setSyncingPrice(true);
		setCartItems(updatedCartItems);

		// Remove item in session.
		removeItemFetcher.submit(
			{
				__action: 'remove_cart_item',
				variation_uuid: targetRemovalVariationUUID,
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

	if (Object.keys(cartItems).length === 0) {
		return (
			<EmptyShoppingCart />
		);
	}

	const handleCancelRemoval = () => {
		// User decide not to cancel, revert cartitem in session.
		if (!targetRemovalVariationUUID || !targetRemovalVariationUUID.current) return;
		const variationUUID = targetRemovalVariationUUID.current;

		setCartItems((prev) => (
			{
				...prev,
				[variationUUID]: {
					...prev[variationUUID],
					quantity: prevQuantity[variationUUID],
				}
			}
		));

		setOpenRemoveItemModal(false);
	}

	const handleOnChangeQuantity = (evt: ChangeEvent<HTMLInputElement>, variationUUID: string) => {
		const quantity = Number(evt.target.value)
		if (isNaN(quantity)) return;
		updateQuantity(variationUUID, quantity);
	}

	const handleOnClickQuantity = (evt: MouseEvent<HTMLLIElement>, variationUUID: string, number: number) => {
		// If user hasn't changed anything. don't bother to update the quantity.
		if (cartItems[variationUUID] && Number(cartItems[variationUUID].quantity) === number) return;
		updateQuantity(variationUUID, number);

		setSyncingPrice(true);
		updateItemQuantityFetcher.submit(
			{
				__action: 'update_item_quantity',
				variation_uuid: variationUUID,
				quantity: number.toString()
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
			[variationUUID]: cartItems[variationUUID].quantity,
		}));

		setCartItems((prev) => (
			{
				...prev,
				[variationUUID]: {
					...prev[variationUUID],
					quantity: number.toString(),
				}
			}
		));
	}

	const handleRemove = (evt: MouseEvent<HTMLButtonElement>, variationUUID: string) => {
		removeItem(variationUUID);
	}

	return (
		<>
			<LoadingBackdrop open={syncingPrice} />

			<RemoveItemModal
				open={openRemoveItemModal}
				itemName="some item"
				onClose={handleCancelRemoval}
				onResult={handleRemoveItemResult}
			/>

			<section className="shopping-cart-section">
				{/* <input type='hidden' name="recoverable-product-id" value= /> */}
				<div className="shopping-cart-container">
					{/* top bar, display back button and title */}
					<div className="shopping-cart_topbar">
						<h1 className="title">
							Shopping Cart
						</h1>

						{
							Object.keys(cartItems).length > 0 && (
								<h1 className="count">
									(
									{Object.keys(cartItems).length} &nbsp;
									{Object.keys(cartItems).length > 1 ? 'items' : 'item'}
									)
								</h1>
							)
						}

					</div>

					{/* title row */}
					<div className="Cart__title-row">

						<div className="Cart__title-row-top" >
							<div className="Cart__title-row-stuff" />

							<h2 className="Cart__title-row-prodname">
								Product Name
							</h2>

						</div>

						<div className="Cart__title-row-bottom">
							<h2 className="Cart__title-row-unitprice">
								Unit Price
							</h2>

							<h2 className="Cart__title-row-quantity">
								Quantity
							</h2>

							<h2 className="Cart__title-row-subtotal">
								Subtotal
							</h2>
						</div>

					</div>

					<div className="cart-items-container">
						{
							// TODO: add typescript to item.
							Object.keys(cartItems).map((prodID) => {
								const item = cartItems[prodID];
								const variationUUID = item.variationUUID;

								return (
									<CartItem
										key={variationUUID}
										prodID={prodID}
										variationUUID={variationUUID}
										image={item.image}
										title={item.title}
										description={item.specName}
										salePrice={Number(item.salePrice)}
										retailPrice={Number(item.retailPrice)}
										quantity={Number(item.quantity)}
										onClickQuantity={(evt, number) => handleOnClickQuantity(evt, variationUUID, number)}
										onChangeQuantity={(evt) => handleOnChangeQuantity(evt, variationUUID)}
										onBlurQuantity={(evt, number) => handleOnBlurQuantity(evt, variationUUID, number)}
										onClickRemove={handleRemove}
									/>
								)
							})
						}



						{/* result row */}
						{
							priceInfo && (
								<div className="result-row">
									<div className="left" />

									<div className="right">
										<h2 className="Cart__result-row-summary">
											Summary
										</h2>
										<div className="subtotal">
											<label> Items </label>
											<div className="result-value"> £{priceInfo.sub_total} </div>
										</div>

										<div className="tax">
											<label> Tax ({TAX * 100}%) </label>
											<div className="result-value"> £{priceInfo.tax_amount} </div>
										</div>

										<div className="shipping">
											<label> Est. Shipping </label>
											<div className="result-value"> £{priceInfo.shipping_fee} </div>
										</div>

										<div className="grand-total">
											<label> <strong>Est. Total</strong> </label>
											<div className="result-value">
												<strong> £{priceInfo.total_amount} </strong>
											</div>
										</div>

										<div className="checkout-button">
											<Link
												// prefetch="intent"
												to="/checkout"
											>
												<RoundButton
													size='large'
													colorScheme='checkout'
													leftIcon={<BsBagCheck fontSize={22} />}
												>
													<b>Proceed Checkout</b>
												</RoundButton>
											</Link>
										</div>
									</div>
								</div>
							)
						}
					</div>
				</div>

				{/* Recommended products - top items */}
				<div className="Cart__rec-products">
					<h1 className="Cart__rec-title">
						<span>top items </span>
						<Link to="/Hot Deal">
							<span className="Cart__rec-see-all"> see all </span>
						</Link>
					</h1>

					{/* @TODO catID should not be hardcoded here */}
					<HorizontalProductsLayout catID={1} />
				</div>

				{/* Recommended products - new trend */}
				<div className="Cart__rec-products">
					<h1 className="Cart__rec-title">
						<span> new trend </span>
						<Link to="/New Trend">
							<span className="Cart__rec-see-all"> see all </span>
						</Link>
					</h1>

					{/* @TODO catID should not be hardcoded here */}
					<HorizontalProductsLayout catID={2} />
				</div>
			</section>
		</>
	);
}

export default Cart;