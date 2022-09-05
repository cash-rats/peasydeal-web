import {
	InputGroup,
	InputLeftAddon,
	Input,
	InputRightAddon,
} from '@chakra-ui/react';

import { BsPlus } from 'react-icons/bs';
import { BiMinus } from 'react-icons/bi';

interface InputQuantityProps {
	value?: number;
	onClickPlus?: () => void;
	onClickMinus?: () => void;
	maxWidth: number;
}

function InputQuantity({
	value = 1,
	onClickPlus = () => {},
	onClickMinus = () => {},
	maxWidth = 20,
}: InputQuantityProps) {
	return (
		<>
			<InputGroup size='xs'>
				<InputLeftAddon
					children={<BiMinus />}
					onClick={onClickPlus}
				/>
				<Input
					maxWidth={maxWidth}
					value={value}
				/>
				<InputRightAddon
					children={<BsPlus />}
					onClick={onClickMinus}
				/>
			</InputGroup>
		</>
	);
};

export default InputQuantity;
