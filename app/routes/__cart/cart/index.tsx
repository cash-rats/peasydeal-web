import { useEffect, useState, useRef, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import type { LinksFunction, LoaderFunction, ActionFunction, } from '@remix-run/node';
import { BsBagCheck } from 'react-icons/bs';

import RoundButton, { links as RoundButtonLinks } from '~/components/RoundButton';
import { commitSession } from '~/sessions';
import { getCart, removeItem, updateItem } from '~/utils/shoppingcart.session';
import type { ShoppingCart } from '~/utils/shoppingcart.session';

// TODO: all script in this file should be removed.
import { TAX } from '~/utils/checkout_accountant';

import CartItem, { links as ItemLinks } from './components/Item';
import RemoveItemModal from './components/RemoveItemModal';
import EmptyShoppingCart, { links as EmptyShippingCartLinks } from './components/EmptyShoppingCart';
import { fetchPriceInfo } from './cart.server';
import type { PriceInfo, PriceQuery } from './cart.server';
import styles from './styles/cart.css';

export const links: LinksFunction = () => {
	return [
		...RoundButtonLinks(),
		...ItemLinks(),
		...EmptyShippingCartLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

type __action_type = 'remove_cart_item' | 'calc_price';

const convertShoppingCartToPriceQuery = (cart: ShoppingCart): PriceQuery[] => {
	return Object.keys(cart).map((productUUID): PriceQuery => {
		const item = cart[productUUID];
		return {
			variation_uuid: item.variationUUID,
			quantity: Number(item.quantity),
		}
	});
}

const __removeCartItemAction = async (prodID: string, request: Request) => {
	const session = await removeItem(request, prodID);
	const cart = await getCart(request);

	let itemCount = 0;

	if (cart && Object.keys(cart).length > 0) {
		itemCount = Object.keys(cart).length
	}

	// `cart_item_count` tells frontend when to perform page refresh. When `cart_item_count`
	// equals 0, frontend will trigger load of the current route which displays empty bag page.
	return new Response(
		JSON.stringify({
			cart_item_count: itemCount,
		}),
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		});
}

const __updatePriceInfo = async (prodID: string, quantity: string, request: Request) => {
	// Retrieve cart from
	const cart = await getCart(request);
	if (!cart || Object.keys(cart).length === 0) return null;
	const item = cart[prodID];
	item.quantity = `${quantity}`;
	const priceQuery = convertShoppingCartToPriceQuery(cart);
	const priceInfo = await fetchPriceInfo({ products: priceQuery });

	// If price info is fetched, update quantity the shopping cart.
	const session = await updateItem(request, item);


	return new Response(
		JSON.stringify({
			price_info: priceInfo,
		}),
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
};

// TODOs:
//   - handle prod_id is falsey value
//   - handle session key not exists
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formEntries = Object.fromEntries(form.entries());
	const actionType = formEntries['__action'] as __action_type || 'remove_cart_item'

	if (actionType === 'remove_cart_item') {
		const prodID = formEntries['prod_id'] as string || '';
		return await __removeCartItemAction(prodID, request);
	}

	if (actionType === 'calc_price') {
		const prodID = formEntries['prod_id'] as string || '';
		const quantity = formEntries['quantity'] as string;
		return await __updatePriceInfo(prodID, quantity, request);
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
		return json<LoaderType>({ cart: {}, priceInfo: null });
	}
	const costQuery = convertShoppingCartToPriceQuery(cart);
	const priceInfo = await fetchPriceInfo({ products: costQuery });

	return json<LoaderType>({ cart, priceInfo });
};

export const CatchBoundary = () => {
	return (<EmptyShoppingCart />);
}

/*
 * Coppy shopee's layout
 * @see https://codepen.io/justinklemm/pen/kyMjjv
 *
 * container width: max-width: 1180px;
 *
 * - [x] show empty shopping cart when no item existed yet, empty shipping cart should be a component instead of a route.
 * - [ ] Remember selected quantity and sales price for each item so that we can calculate total price in result row.
 * - [ ] Add `~~$99.98 Now $49.99 You Saved $50` text.
 * - [ ] When quantity is deducted to 0, popup a notification that the item is going to be removed.
 * - [x] Checkout flow.
 */
function Cart() {
	const preloadData = useLoaderData<LoaderType>();

	const [cartItems, setCartItems] = useState<ShoppingCart>(preloadData.cart);
	const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(preloadData.priceInfo);

	const [openRemoveItemModal, setOpenRemoveItemModal] = useState(false);

	const removeItemFetcher = useFetcher();
	const updatePriceFetcher = useFetcher();

	const targetRemovalProdID = useRef<null | string>(null);

	// let debounceTimer = useRef<NodeJS.Timeout | string | number | undefined>(undefined);
	// const calcPriceInfo = useCallback((cart: ShoppingCart) => {
	// 	console.log('calcPriceInfo', cart);
	// }, [])

	// If cart item contains no item, we simply redirect user to `/cart` so that
	// corresponding loader can display empty cart page to user.
	useEffect(() => {
		if (removeItemFetcher.type === 'done') {
			const { cart_item_count } = JSON.parse(removeItemFetcher.data);

			if (cart_item_count === 0) {
				removeItemFetcher.load('/cart?index');
			}
		}
	}, [removeItemFetcher]);

	// When user update the quantity, we need to update the cost by querying backend.
	useEffect(() => {
		if (updatePriceFetcher.type === 'done') {
			const data = updatePriceFetcher.data as string | null;
			if (!data) return;

			const dataJSON = JSON.parse(data);
			setPriceInfo(dataJSON.price_info);
		}
	}, [updatePriceFetcher]);

	const updateItemQuantity = (quantity: number, prodID: string) => {
		// updatePriceFetcher.submit(
		// 	{
		// 		__action: 'calc_price',
		// 		prod_id: prodID,
		// 		quantity: `${quantity}`,
		// 	},
		// 	{
		// 		method: 'post',
		// 		action: '/cart?index'
		// 	}
		// );

		// const newCart = {
		// 	...cartItems,
		// 	[prodID]: {
		// 		...cartItems[prodID],
		// 		quantity: `${quantity}`,
		// 	}
		// } as ShoppingCart;

		// if (debounceTimer.current !== undefined) {
		// 	clearTimeout(debounceTimer.current);
		// 	debounceTimer.current = undefined;
		// }

		// debounceTimer.current = setTimeout(() => {
		// 	calcPriceInfo(newCart);
		// }, 200)

		// setCartItems(newCart);

		// setCartItems((prev) => (
		// 	{
		// 		...prev,
		// 		[prodID]: {
		// 			...prev[prodID],
		// 			quantity: `${quantity}`,
		// 		}
		// 	}
		// ));
	};

	const handleMinusQuantity = (quantity: number, prodID: string, askRemoval: boolean) => {
		// when quantity equals 1, display popup to notify customer for item removal.
		if (askRemoval) {
			targetRemovalProdID.current = prodID;
			setOpenRemoveItemModal(true);

			return;
		}

		updateItemQuantity(quantity, prodID);
	};

	const handleRemoveItemResult = (res: boolean) => {
		if (!res) return false;
		if (!targetRemovalProdID.current) return;

		// Remove cart item on the client side before mutating session.
		const updatedCartItems = Object.keys(cartItems).reduce((newCartItems: ShoppingCart, prodID) => {
			if (prodID === targetRemovalProdID.current) return newCartItems;
			newCartItems[prodID] = cartItems[prodID];
			return newCartItems
		}, {})

		setCartItems(updatedCartItems);

		removeItemFetcher.submit(
			{
				__action: 'remove_cart_item',
				prod_id: targetRemovalProdID.current
			},
			{
				method: 'post',
				action: '/cart?index',
			},
		)

		setOpenRemoveItemModal(false);
	}

	if (Object.keys(cartItems).length === 0) {
		return (
			<EmptyShoppingCart />
		);
	}

	return (
		<section className="shopping-cart-section">
			<RemoveItemModal
				open={openRemoveItemModal}
				itemName="some item"
				onClose={() => setOpenRemoveItemModal(false)}
				onResult={handleRemoveItemResult}
			/>

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

				<div className="cart-items-container">
					{
						// TODO: add typescript to item.
						Object.keys(cartItems).map((prodID) => {
							const item = cartItems[prodID];
							return (
								<CartItem
									key={prodID}
									prodID={prodID}
									image={item.image}
									title={item.title}
									description={item.specName}
									salePrice={Number(item.salePrice)}
									retailPrice={Number(item.retailPrice)}
									quantity={Number(item.quantity)}
									onPlus={updateItemQuantity}
									onMinus={handleMinusQuantity}
									onChangeQuantity={updateItemQuantity}
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
									<div className="subtotal">
										<label> Subtotal </label>
										<div className="result-value"> {priceInfo.sub_total} </div>
									</div>

									<div className="tax">
										<label> Tax ({TAX * 100}%) </label>
										<div className="result-value"> {priceInfo.tax_amount} </div>
									</div>

									<div className="shipping">
										<label> Shipping </label>
										<div className="result-value"> ${priceInfo.shipping_fee} </div>
									</div>

									<div className="grand-total">
										<label> Total </label>
										<div className="result-value"> ${priceInfo.total_amount} </div>
									</div>

									<div className="checkout-button">
										<Link prefetch="intent" to="/checkout">
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
		</section>
	);
}

export default Cart;