import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import {
	InputGroup,
	InputLeftAddon,
	Input,
	InputRightAddon,
} from '@chakra-ui/react';
import { BiMinus } from 'react-icons/bi';
import { BsPlus } from 'react-icons/bs';

import { commitSession, getSession } from '~/sessions';
import type { SessionKey } from '~/sessions';

import styles from './styles/Item.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
};

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const prodID = body.get('prodID') as string || '';
	const quantity = body.get('quantity');
	const sessionKey: SessionKey = 'shopping_cart';
	const session = await getSession(
		request.headers.get(("Cookie"))
	);

	if (!session.has(sessionKey)) return null;

	const cartItems = session.get(sessionKey);

	// Only update item quantity if product exists in cart.
	if (cartItems.hasOwnProperty(prodID)) {
		cartItems[prodID].quantity = quantity;
		session.set(sessionKey, cartItems);
	}

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
	const [itemQauntity, setItemQuantity] = useState<number>(quantity);
	const cartItemFetcher = useFetcher();

	// Update cart item item quantity in session if user isn't logged in yet, or, database if user has logged in.
	const updateCartItemQuantityAction = (prodID: string, quantity: string) => cartItemFetcher.submit({
		prodID,
		quantity,
	}, { method: 'post', action: '/cart/components/Item?index' });


	const handleClickAddQuantity = () => {
		const q = itemQauntity + 1;
		updateCartItemQuantityAction(prodID, q.toString());
		setItemQuantity(q);
		onPlus(q, prodID);
	}

	const handleClickMinusQuantity = () => {
		// We do not allow quantity deduction when quantity equals 1
		if (itemQauntity === 1) {
			onMinus(itemQauntity, prodID, true);
			return;
		}

		const q = itemQauntity - 1;
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
						<InputGroup size='xs'>
							<InputLeftAddon
								children={<BiMinus />}
								onClick={handleClickMinusQuantity}
							/>
							<Input
								maxWidth={20}
								value={itemQauntity}
								onChange={handleChangeQuantity}
							/>
							<InputRightAddon
								children={<BsPlus />}
								onClick={handleClickAddQuantity}
							/>
						</InputGroup>
					</cartItemFetcher.Form>
				</div>

				<div className="product-total">
					{(itemQauntity * salePrice).toFixed(2)}
				</div>
			</div>
		</div>
	);
}

export default CartItem;
