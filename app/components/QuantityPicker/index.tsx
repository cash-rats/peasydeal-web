import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';

import styles from './styles/QuantityPicker.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface QuantityPickerProps {
  value?: number;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onIncrease?: (v: number) => void;
  onDecrease?: (v: number) => void;
}

export default function QuantityPicker({
  value = 0,
  onIncrease = () => { },
  onDecrease = () => { },
  onChange = () => { },
}: QuantityPickerProps) {

  const handleIncrease = () => {
    onIncrease(value);
  };

  const handleDecrease = () => {
    onDecrease(value);
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(evt.target.value))) return;
    onChange(evt);
  }

  return (
    <div className="QuantityPicker__wrapper">
      <div className="QuantityPicker__icon-wrapper">
        <IconButton onClick={handleDecrease} disableTouchRipple>
          <AiOutlineMinus fontSize={16} />
        </IconButton>
      </div>

      <input
        type="text"
        className="QuantityPicker__text"
        value={value}
        onChange={handleChange}
      />

      <div className="QuantityPicker__icon-wrapper">
        <IconButton onClick={handleIncrease} disableTouchRipple>
          <AiOutlinePlus fontSize={16} />
        </IconButton>
      </div>
    </div>
  )
}