import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import QuantityDropDown, { links as QuantityDropDownLinks } from '~/components/QuantityDropDown';

import styles from './styles/Item.css';

export const links: LinksFunction = () => {
	return [
		...QuantityDropDownLinks(),
		{ rel: 'stylesheet', href: styles },
	];
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
	onChangeQuantity?: (quantity: number, prodID: string, askRemoval: boolean) => void;
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
	const handleChangeQuantity = (evt: ChangeEvent<HTMLInputElement>, number: number) => {
		setItemQuantity(number);

		if (number === 0) {
			onChangeQuantity(number, prodID, true);
			return;
		}

		onChangeQuantity(number, prodID, false);
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
					<QuantityDropDown
						value={itemQuantity}
						onBlur={handleChangeQuantity}
					/>
				</div>

				<div className="product-total">
					{(itemQuantity * salePrice).toFixed(2)}
				</div>
			</div>
		</div>
	);
}

export default CartItem;
