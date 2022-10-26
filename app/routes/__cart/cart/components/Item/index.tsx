import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

import { getItem, updateItem } from '~/utils/shoppingcart.session';
import { commitSession } from '~/sessions';
import QuantityPicker, { links as QuantityPickerLinks } from '~/components/QuantityPicker';

import styles from './styles/Item.css';

export const links: LinksFunction = () => {
	return [
		...QuantityPickerLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const prodID = body.get('prodID') as string || '';
	const quantity = body.get('quantity') as string;

	const item = await getItem(request, prodID);
	if (!item) return null;
	item.quantity = quantity;
	const session = await updateItem(request, item);

	return new Response('', {
		headers: {
			"Set-Cookie": await commitSession(session),
		}
	});
};

interface CartItemProps {
	prodID: string;
	image: string;
	title: string;
	description: string;
	salePrice: number;
	retailPrice: number;
	quantity?: number;
	onMinus?: (quantity: number, prodID: string, askRemoval: boolean) => void;
	onPlus?: (quantity: number, prodID: string) => void;
	onChangeQuantity?: (quantity: number, prodID: string) => void;
}

function CartItem({
	prodID,
	image,
	title,
	description,
	salePrice,
	retailPrice,
	quantity = 1,
	onMinus = () => { },
	onPlus = () => { },
	onChangeQuantity = () => { },
}: CartItemProps) {
	const [itemQuantity, setItemQuantity] = useState<number>(quantity);
	const cartItemFetcher = useFetcher();

	// Update cart item item quantity in session if user isn't logged in yet, or, database if user has logged in.
	const updateCartItemQuantityAction = (prodID: string, quantity: string) => cartItemFetcher.submit({
		prodID,
		quantity,
	}, { method: 'post', action: '/cart/components/Item?index' });


	const handleClickAddQuantity = () => {
		const q = itemQuantity + 1;
		updateCartItemQuantityAction(prodID, q.toString());
		setItemQuantity(q);
		onPlus(q, prodID);
	}

	const handleClickMinusQuantity = () => {
		// We do not allow quantity deduction when quantity equals 1
		if (itemQuantity === 1) {
			onMinus(itemQuantity, prodID, true);
			return;
		}

		const q = itemQuantity - 1;
		updateCartItemQuantityAction(prodID, q.toString());
		setItemQuantity(q);
		onMinus(q, prodID, false);
	}

	const handleChangeQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
		const q = Number(evt.target.value)
		if (isNaN(q)) return;
		updateCartItemQuantityAction(prodID, q.toString());
		setItemQuantity(q);
		onChangeQuantity(q, prodID);
	}

	return (
		<div className="cart-item">
			{/* Item image */}
			<div className="top">
				<div className="product-image">
					<img alt={title} src={image} />
				</div>

				<div className="product-description">
					<div className="product-title">
						{title}
					</div>

					<p className="product-description-text">
						{description}
					</p>

					<div className="product-price-mobile">
						{retailPrice}
					</div>
				</div>
			</div>

			<div className="bottom">
				<div className="product-price">
					{salePrice}
				</div>

				<div className="product-quantity">
					<cartItemFetcher.Form>
						<QuantityPicker
							value={itemQuantity}
							onChange={handleChangeQuantity}
							onDecrease={handleClickMinusQuantity}
							onIncrease={handleClickAddQuantity}
						/>
					</cartItemFetcher.Form>
				</div>

				<div className="product-total">
					{(itemQuantity * salePrice).toFixed(2)}
				</div>
			</div>
		</div>
	);
}

export default CartItem;
