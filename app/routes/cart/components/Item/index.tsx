import { useState } from 'react';
import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import QuantityDropDown, { links as QuantityDropDownLinks } from '~/components/QuantityDropDown';
import { BsTrash } from 'react-icons/bs';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';

import styles from './styles/Item.css';

export const links: LinksFunction = () => {
	return [
		...QuantityDropDownLinks(),
		{ rel: 'stylesheet', href: styles },
	];
};

type ItemProps = {
	variationUUID: string;
	image: string;
	title: string;
	description: string;
	salePrice: number;
	retailPrice: number;
	quantity: number;
	purchaseLimit: number;
}
interface CartItemProps {
	item: ItemProps;
	calculating?: boolean;
	onMinus?: (quantity: number, prodID: string, askRemoval: boolean) => void;
	onPlus?: (quantity: number, prodID: string) => void;
	onClickQuantity?: (evt: MouseEvent<HTMLLIElement>, number: number) => void;
	onChangeQuantity?: (evt: ChangeEvent<HTMLInputElement>, quantity: number) => void;
	onBlurQuantity?: (evt: FocusEvent<HTMLInputElement>, number: number) => void;
	onClickRemove?: (evt: MouseEvent<HTMLButtonElement>, prodID: string) => void;
}

function CartItem({
	calculating = false,
	item = {
		variationUUID: '',
		image: '',
		title: '',
		description: '',
		salePrice: 0,
		retailPrice: 0,
		quantity: 1,
		purchaseLimit: 10,
	},
	onChangeQuantity = () => { },
	onClickQuantity = () => { },
	onBlurQuantity = (evt: FocusEvent<HTMLInputElement>, quantity: number) => { },
	onClickRemove = (evt: MouseEvent<HTMLButtonElement>, prodID: string) => { },
}: CartItemProps) {
	const [exceedMaxMsg, setExceedMaxMsg] = useState('');

	const handleChangeQuantity = (evt: ChangeEvent<HTMLInputElement>, quantity: number) => {
		setExceedMaxMsg('');
		if (quantity > item.purchaseLimit) {
			setExceedMaxMsg(`Max ${item.purchaseLimit} pieces`);
			return;
		}
		onChangeQuantity(evt, quantity);
	};

	const handleBlurQuantity = (evt: FocusEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>, quantity: number) => {
		setExceedMaxMsg('');
		if (quantity > item.purchaseLimit) {
			setExceedMaxMsg(`Max ${item.purchaseLimit} pieces`);
			return;
		};
		onBlurQuantity(evt, quantity);
	};

	return (
		<div className="cart-item">
			{/* Item image */}
			<div className="top">
				<div className="product-image">
					<img alt={item.title} src={item.image} />
				</div>

				<div className="product-description">
					<div className="product-title">
						{item.title}
					</div>

					<p className="product-description-text">
						{item.description}
					</p>

					<div className="product-price-mobile">
						<span className="CartItem__sale-price">£{item.salePrice}</span> &nbsp;
						<span className="CartItem__retail-price">£{item.retailPrice}</span>
					</div>
				</div>
			</div>

			<div className="bottom">

				<div className="product-price">
					£{item.salePrice}
				</div>

				<div className="relative max-w-full flex flex-col items-center md:w-[40%]">
					<div className="flex flex-row items-center" >
						<span className="CartItem__quantity-text"> QTY </span>
						<div className="flex flex-col">
							<QuantityDropDown
								value={item.quantity}
								onClickNumber={onClickQuantity}
								onChange={handleChangeQuantity}
								onBlur={handleBlurQuantity}
								disabled={calculating}
							/>
						</div>

						<div className="CartItem__remove-btn">
							<IconButton onClick={(evt) => onClickRemove(evt, item.variationUUID)}>
								<BsTrash />
							</IconButton>
						</div>
					</div>

					{
						exceedMaxMsg && (
							<p className="mt-0 w-full mt text-[#757575] font-sm md:absolute top-[-25px]">
								Max {item.purchaseLimit} pieces
							</p>
						)
					}
				</div>


				<div className="product-total">
					{
						calculating
							? (
								<>
									£ &nbsp; <Skeleton width={40} height={35} />
								</>
							)
							: `£${(item.quantity * item.salePrice).toFixed(2)}`
					}

				</div>
			</div>
		</div>
	);
}

export default CartItem;
