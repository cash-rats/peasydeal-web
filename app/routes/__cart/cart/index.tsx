import { useState } from 'react';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { StatusCodes } from 'http-status-codes';
import { Button } from '@chakra-ui/react';
import { BsBagCheck } from 'react-icons/bs';

import { getSession } from '~/sessions';
import type { SessionKey } from '~/sessions';
import {
	calcSubTotal,
	calcGrandTotal,
	calcPriceWithTax,
	TAX,
	SHIPPING_FEE
} from '~/utils/checkout_accountant';

import CartItem, { links as ItemLinks } from './components/Item';
import styles from './styles/cart.css';

export const links: LinksFunction = () => {
	return [
		...ItemLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

/*
 * Fetch cart items from product list when user is not logged in.
 */
export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const sessionKey: SessionKey = 'shopping_cart';

	if (!session.has(sessionKey)) {
		throw redirect('/empty_cart');
	}

	const cartItems = session.get(sessionKey);

	if (cartItems && Object.keys(cartItems).length === 0) {
		throw redirect('/empty_cart');
	}

	return json(cartItems, { status: StatusCodes.OK });
};

/*
 * Coppy shopee's layout
 * @see https://codepen.io/justinklemm/pen/kyMjjv
 *
 * container width: max-width: 1180px;
 *
 * - [ ] show empty shopping cart when no item existed yet.
 * - [ ] Remember selected quantity and sales price for each item so that we can calculate total price in result row.
 * - [ ] Add `~~$99.98 Now $49.99 You Saved $50` text.
 * - [ ] Checkout flow.
 */
function Cart() {
	const cartItemsData = useLoaderData();
	const [cartItems, setCartItems] = useState(cartItemsData);

	// TODO when quantity equals 0, display popup to notify customer for item removal.
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

	return (
		<section className="shopping-cart-section">
			<div className="shopping-cart-container">
				{/* top bar, display back button and title */}
				<div className="shopping-cart_topbar">
					<h1 className="title">
						Shopping Cart
					</h1>
				</div>

				<div className="cart-items-container">
					<div className="head-row">
						<div className="image-label" />

						<h1 className="description-label">
							Description
						</h1>

						<h1 className="price-label">
							Price
						</h1>

						<h1 className="quantity-label">
							Quantity
						</h1>

						<h1 className="total-label">
							Total
						</h1>
					</div>

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
									onMinus={updateItemQuantity}
									onChangeQuantity={updateItemQuantity}
								/>
							)
						})
					}

					{/* result row */}
					<div className="result-row">
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
								<Button
									size='lg'
									colorScheme='green'
									leftIcon={<BsBagCheck fontSize={22} />}
								>
									Proceed Checkout
								</Button>
							</Link>
						</div>
					</div>
				</div>

				{/* show empty shopping cart when no items */}
			</div>
		</section>
	);
}

export default Cart;
