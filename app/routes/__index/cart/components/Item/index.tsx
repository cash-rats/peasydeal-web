import { useState, ChangeEvent} from 'react';
import type { LinksFunction } from '@remix-run/node';
import {
	InputGroup,
	InputLeftAddon,
	Input,
	InputRightAddon,
} from '@chakra-ui/react';
import { BiMinus } from 'react-icons/bi';
import { BsPlus } from 'react-icons/bs';

import styles from './styles/Item.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
}

interface CartItemProps {
	image: string;
	title: string;
	description: string;
	salePrice: number;
	retailPrice: number;
	quantity?: number;

	onMinus?: (quantity: number) => void;
	onPlus?: (quantity: number) => void;
}

function CartItem ({
	image,
	title,
	description,
	salePrice,
	retailPrice,
	quantity = 1,
	onMinus = () => {},
	onPlus = () => {},
}: CartItemProps) {
	const [itemQauntity, setItemQuantity] = useState<number>(quantity);

	const handleClickAddQuantity = () => {
		const q = itemQauntity + 1;
		setItemQuantity(q);
		onPlus(q);
	}

	const handleClickMinusQuantity = () => {
		// We do not allow quantity deduction when quantity equals 1
		if (itemQauntity === 1) {
			onMinus(itemQauntity);
			return;
		}

		const q = itemQauntity - 1;
		setItemQuantity(q);
		onMinus(q);
	}

	const handleChangeQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
		if (isNaN(Number(evt.target.value))) return;
		setItemQuantity(Number(evt.target.value));
	}

	return (
		<div className="cart-item">
			{/* Item image */}
			<div className="top">
				<div className="product-image">
					<img src={image} />
				</div>

				<div className="product-description">
					<div className="product-title">
						{ title }
					</div>

					<p className="product-description-text">
						{ description }
					</p>

					<div className="product-price-mobile">
						{ retailPrice }
					</div>
				</div>
			</div>

			<div className="bottom">
				<div className="product-price">
					{ salePrice }
				</div>

				<div className="product-quantity">
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
				</div>

				<div className="product-total">
					{ (itemQauntity * salePrice).toFixed(2) }
				</div>
			</div>
		</div>
	);
}

export default CartItem;
