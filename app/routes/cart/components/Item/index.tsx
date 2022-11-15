import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import QuantityDropDown, { links as QuantityDropDownLinks } from '~/components/QuantityDropDown';
import { BsTrash } from 'react-icons/bs';
import IconButton from '@mui/material/IconButton';

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
	onClickRemove?: (evt: MouseEvent<HTMLButtonElement>, prodID: string) => void;
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
	onBlurQuantity = (evt: FocusEvent<HTMLInputElement>, quantity: number) => { },
	onClickRemove = (evt: MouseEvent<HTMLButtonElement>, prodID: string) => { },
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
						<span className="CartItem__sale-price">£{salePrice}</span> &nbsp;
						<span className="CartItem__retail-price">£{retailPrice}</span>
					</div>
				</div>
			</div>

			<div className="bottom">
				<div className="product-price">
					£{salePrice}
				</div>

				<div className="product-quantity">
					<span className="CartItem__quantity-text"> QTY </span>
					<QuantityDropDown
						value={quantity}
						onClickNumber={onClickQuantity}
						onChange={onChangeQuantity}
						onBlur={onBlurQuantity}
					/>

					<div className="CartItem__remove-btn">
						<IconButton onClick={(evt) => onClickRemove(evt, prodID)}>
							<BsTrash />
						</IconButton>
					</div>
				</div>

				<div className="product-total">
					£{(quantity * salePrice).toFixed(2)}
				</div>
			</div>
		</div>
	);
}

export default CartItem;
