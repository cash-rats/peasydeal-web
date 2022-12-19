import { useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent, FocusEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import useBodyClick from '~/hooks/useBodyClick';

import styles from './styles/QuantityDropDown.css';

export const links: LinksFunction = () => {
  return [{ href: styles, rel: 'stylesheet' }];
}

interface QuantityDropDownProps {
  value?: number;
  maxNum?: number
  onChange?: (evt: ChangeEvent<HTMLInputElement>, quantity: number) => void;
  onBlur?: (evt: FocusEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>, number: number) => void;
  onClickNumber?: (evt: MouseEvent<HTMLLIElement>, number: number) => void;
  disabled?: boolean;
}

export default function QuantityDropDown({
  value = 1,
  maxNum = 5,
  onChange = () => { },
  onBlur = () => { },
  onClickNumber = () => { },
  disabled = false,
}: QuantityDropDownProps) {
  const dropDownListRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const numArr = new Array(maxNum).fill(0).map((_, i) => i + 1);
  useBodyClick((evt: MouseEvent<HTMLBodyElement>) => {
    if (!dropDownListRef || !dropDownListRef.current) return;

    if (dropDownListRef.current !== evt.target && !dropDownListRef.current.contains(evt.target)) {
      setOpen(false);
    }
  });

  const handleFocus = () => {
    setOpen(true);
  }

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(evt.target.value);
    if (isNaN(quantity)) return;
    onChange(evt, quantity);
  }

  const handleOnBlur = (evt: FocusEvent<HTMLInputElement>) => {
    const number = Number(evt.target.value);
    if (isNaN(number)) return;
    onBlur(evt, number);
  }

  const handleClickNumber = (evt: MouseEvent<HTMLLIElement>, number: number) => {
    setOpen(false);
    onClickNumber(evt, number);

    if (dropDownListRef && dropDownListRef.current) {
      dropDownListRef.current.blur();
    }
  }

  return (
    <div ref={dropDownListRef} className="QuantityDropDown__wrapper">
      <input
        type="text"
        className="QuantityDropDown__text"
        maxLength={3}
        onFocus={handleFocus}
        value={value}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        disabled={disabled}
      />

      {
        open && (
          <ul className="QuantityDropDown__list">
            {
              numArr.map((v) => {
                return (
                  <li
                    key={v}
                    onMouseUp={(evt) => {
                      console.log('trigger onMouseUp');
                    }}
                    onMouseDown={(evt) => {
                      handleClickNumber(evt, v)
                    }}
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