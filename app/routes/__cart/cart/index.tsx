import { useEffect, useState, useRef } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import type { LinksFunction, LoaderFunction, ActionFunction, } from '@remix-run/node';
import { BsBagCheck } from 'react-icons/bs';

import RoundButton, { links as RoundButtonLinks } from '~/components/RoundButton';
import { commitSession } from '~/sessions';
import { getCart, removeItem } from '~/utils/shoppingcart.session';
import {
	calcSubTotal,
	calcGrandTotal,
	calcPriceWithTax,
	TAX,
	SHIPPING_FEE
} from '~/utils/checkout_accountant';

import CartItem, { links as ItemLinks } from './components/Item';
import RemoveItemModal from './components/RemoveItemModal';
import EmptyShoppingCart, { links as EmptyShippingCartLinks } from './components/EmptyShoppingCart';
import styles from './styles/cart.css';

export const links: LinksFunction = () => {
	return [
		...RoundButtonLinks(),
		...ItemLinks(),
		...EmptyShippingCartLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

// TODOs:
//   - handle prod_id is falsey value
//   - handle session key not exists
export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const prodID = body.get('prod_id') as string || '';
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

/*
 * Fetch cart items from product list when user is not logged in.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// If cart contains no items, display empty cart page via CatchBoundary
	const cart = await getCart(request);

	if (!cart || Object.keys(cart).length === 0) {
		return json([]);
	}

	return json(cart);
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
	const cartItemsData = useLoaderData();
	const [cartItems, setCartItems] = useState(cartItemsData);
	const [openRemoveItemModal, setOpenRemoveItemModal] = useState(false);
	const removeItemFetcher = useFetcher()
	const targetRemovalProdID = useRef<null | string>(null);

	// If cart item contains no item, we simply redirect user to `/cart` so that
	// corresponding loader can display empty cart page to user.
	useEffect(() => {
		if (removeItemFetcher.type === 'done') {
			const { cart_item_count } = JSON.parse(removeItemFetcher.data);

			if (cart_item_count === 0) {
				removeItemFetcher.load('/cart?index');
			}
		}
	}, [removeItemFetcher])

	const updateItemQuantity = (quantity: number, prodID: string) => {
		setCartItems((prev) => (
			{
				...prev,
				[prodID]: {
					...prev[prodID],
					quantity,
				}
			}
		));
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
		const updatedCartItems = Object.keys(cartItems).reduce((newCartItems, prodID) => {
			if (prodID === targetRemovalProdID.current) return newCartItems;
			newCartItems[prodID] = cartItems[prodID];
			return newCartItems
		}, {})

		setCartItems(updatedCartItems);

		removeItemFetcher.submit(
			{ prod_id: targetRemovalProdID.current },
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
									description={item.subTitle}
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
					<div className="result-row">
						<div className="left" />

						<div className="right">
							<div className="subtotal">
								<label> Subtotal </label>
								<div className="result-value"> ${
									calcSubTotal(cartItems).toFixed(2)
								} </div>
							</div>

							<div className="tax">
								<label> Tax ({TAX * 100}%) </label>
								<div className="result-value"> {
									calcPriceWithTax(
										Number(calcSubTotal(cartItems).toFixed(2)),
									).toFixed(2)
								}
								</div>
							</div>

							<div className="shipping">
								<label> Shipping </label>
								<div className="result-value"> ${SHIPPING_FEE} </div>
							</div>

							<div className="grand-total">
								<label> Grand Total </label>
								<div className="result-value"> ${calcGrandTotal(cartItems).toFixed(2)} </div>
							</div>

							<div className="checkout-button">
								<Link to="/checkout">
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
				</div>
			</div>
		</section>
	);
}

export default Cart;