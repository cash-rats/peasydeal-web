import type { ChangeEvent } from 'react';
import type { LinksFunction } from 'react-router';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

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
        <button
          type="button"
          className="QuantityPicker__icon-button"
          onClick={handleDecrease}
          aria-label="Decrease quantity"
        >
          <AiOutlineMinus fontSize={16} />
        </button>
      </div>

      <input
        type="text"
        className="QuantityPicker__text"
        value={value}
        onChange={handleChange}
      />

      <div className="QuantityPicker__icon-wrapper">
        <button
          type="button"
          className="QuantityPicker__icon-button"
          onClick={handleIncrease}
          aria-label="Increase quantity"
        >
          <AiOutlinePlus fontSize={16} />
        </button>
      </div>
    </div>
  )
}
