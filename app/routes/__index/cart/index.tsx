import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LinksFunction, ActionFunction, LoaderFunction } from '@remix-run/node';
import {
	InputGroup,
	Input,
	InputLeftAddon,
	InputRightAddon,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { BiMinus } from 'react-icons/bi';
import { StatusCodes } from 'http-status-codes';

import { getSession, SessionKey } from '~/sessions';

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

	let cartItems = {};

	if (session.has(sessionKey)) {
		cartItems = session.get(sessionKey);
	}

	return json(cartItems, { status: StatusCodes.OK });
};


/*
 * Update items in cart when client update quantity (or remove).
 */
export const action: ActionFunction = () => {};

/*
 * Coppy shopee's layout
 * @see https://codepen.io/justinklemm/pen/kyMjjv
 *
 * container width: max-width: 1180px;
 *
 * - [ ] show empty shopping cart when no item existed yet.
 */
function Cart() {
	const cartItems = useLoaderData();
	console.log('debug', cartItems);

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
									image={item.image}
									title={item.title}
									description={item.subTitle}
									salePrice={Number(item.salePrice)}
									retailPrice={Number(item.retailPrice)}
									quantity={Number(item.quantity)}
								/>
							)
						})
					}

					{/* result row */}
					<div className="result-row">
						<div className="subtotal">
							<label> Subtotal </label>
							<div className="result-value"> $123 </div>
						</div>

						<div className="tax">
							<label> Tax (5%) </label>
							<div className="result-value"> $123 </div>
						</div>

						<div className="shipping">
							<label> Shipping </label>
							<div className="result-value"> $123 </div>
						</div>

						<div className="grand-total">
							<label> Grand Total </label>
							<div className="result-value"> $123 </div>
						</div>
					</div>
				</div>

				{/* show empty shopping cart whe no items */}
			</div>
		</section>
	);
}

export default Cart;
