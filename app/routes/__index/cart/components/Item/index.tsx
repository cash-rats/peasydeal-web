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
	salePrice: string;
	retailPrice: string;
	quantity: number;
}

function CartItem ({
	image,
	title,
	description,
	salePrice,
	retailPrice,
	quantity,
}: CartItemProps) {
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
						<InputLeftAddon children={<BiMinus />} />
						<Input maxWidth={20} value={1000} />
						<InputRightAddon children={<BsPlus />} />
					</InputGroup>
				</div>

				<div className="product-total">
					{ quantity }
				</div>
			</div>
		</div>
	);
}

export default CartItem;
