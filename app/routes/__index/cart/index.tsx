import type { LinksFunction } from '@remix-run/node';

import styles from './styles/cart.css';

console.log('styles', styles);

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
};

/*
 * Coppy shopee's layout
 * @see https://codepen.io/justinklemm/pen/kyMjjv
 *
 * container width: max-width: 1180px;
 */
function Cart() {
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

						<div className="remove-label" />

						<h1 className="total-label">
							Total
						</h1>
					</div>

					<div className="cart-item">
						{/* Item image */}
						<div className="product-image">
							<img src="https://s.cdpn.io/3/large-NutroNaturalChoiceAdultLambMealandRiceDryDogFood.png" />
						</div>

						<div className="product-description">
							<div className="product-title">
								Dingo Dog Bones
							</div>

							<p className="product-description-text">
								The best dog bones of all time. Holy crap. Your dog will be begging for these things! I got curious once and ate one myself. I'm a fan.
							</p>
						</div>

						<div className="product-price">
							$12.99
						</div>

						<div className="product-quantity">
							2
						</div>

						<div className="product-remove">
						</div>

						<div className="product-total">
							2
						</div>
					</div>

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
