import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
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
	onClickQuantity?: (evt: MouseEvent<HTMLLIElement>, number: number) => void;
	onChangeQuantity?: (evt: ChangeEvent<HTMLInputElement>) => void;
	onBlurQuantity?: (evt: FocusEvent<HTMLInputElement>, number: number) => void;
}

function CartItem({
	prodID,
	image,
	title,
	description,
	salePrice,
	retailPrice,
	quantity = 1,
	onChangeQuantity = () => { },
	onClickQuantity = () => { },
	onBlurQuantity = (evt: FocusEvent<HTMLInputElement>, number: number) => { },
}: CartItemProps) {
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
						value={quantity}
						onClickNumber={onClickQuantity}
						onChange={onChangeQuantity}
						onBlur={onBlurQuantity}
					/>
				</div>

				<div className="product-total">
					{(quantity * salePrice).toFixed(2)}
				</div>
			</div>
		</div>
	);
}

export default CartItem;
