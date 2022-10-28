import { useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import useBodyClick from '~/hooks/useBodyClick';

import styles from './styles/QuantityDropDown.css';

export const links: LinksFunction = () => {
  return [{ href: styles, rel: 'stylesheet' }];
}

interface QuantityDropDownProps {
  value?: number;
  maxNum?: number
  onChange?: (evt: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>, number: number) => void;
}

export default function QuantityDropDown({
  value = 1,
  maxNum = 5,
  onChange = () => { },
}: QuantityDropDownProps) {
  const dropDownListRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const numArr = new Array(maxNum).fill(0).map((_, i) => i + 1);
  const [cValue, setCvalue] = useState(value);

  useBodyClick((evt: MouseEvent) => {
    evt.preventDefault();
    if (!dropDownListRef || !dropDownListRef.current) return;

    if (dropDownListRef.current !== evt.target && !dropDownListRef.current.contains(evt.target)) {
      setOpen(false);
    }
  });

  const handleFocus = () => {
    setOpen(true);
  }

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const number = Number(evt.target.value);
    if (isNaN(number)) return;
    setCvalue(number);
    onChange(evt, number);
  }

  const handleClickNumber = (evt: MouseEvent<HTMLLIElement>, number: number) => {
    setOpen(false);
    setCvalue(number);
    onChange(evt, number);
  }

  return (
    <div ref={dropDownListRef} className="QuantityDropDown__wrapper">
      <input
        type="text"
        className="QuantityDropDown__text"
        maxLength={3}
        onFocus={handleFocus}
        value={cValue}
        onChange={handleOnChange}
      />

      {
        open && (
          <ul className="QuantityDropDown__list">
            {
              numArr.map((v) => {
                return (
                  <li
                    key={v}
                    onClick={(evt) => handleClickNumber(evt, v)}
                  >
                    {v}
                  </li>
                )
              })
            }
          </ul>
        )
      }
    </div>
  );
}