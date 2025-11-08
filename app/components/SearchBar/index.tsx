import type { ForwardedRef, MouseEvent, ChangeEvent, FocusEvent, TouchEvent } from 'react';
import { useEffect, useState, forwardRef, useRef } from 'react';
import type { InputBaseProps } from '@mui/material/InputBase';
import ClearIcon from '@mui/icons-material/Clear';
import clsx from 'clsx';
import type { LinksFunction } from 'react-router';

import BaseInput from '~/components/BaseInput';

import styles from './styles/SearchBar.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SearchBarProps extends InputBaseProps {
  form?: string | undefined;

  name?: string;

  onClick?: (evt: MouseEvent<HTMLDivElement>) => void;

  onTouchEnd?: (evt: TouchEvent<HTMLDivElement>) => void;

  // When user clicks on magnifier icon.
  onSearch?: (criteria: string, evt: MouseEvent<HTMLButtonElement>) => void;

  onClear?: (evt: MouseEvent<HTMLSpanElement>) => void;

  // When search content changes
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;

  // When search input is focused
  onFocus?: (evt: FocusEvent<HTMLInputElement>) => void;

  // When search input is blurred
  onBlur?: (evt: FocusEvent<HTMLInputElement>) => void;

  placeholder?: string;

  onMountRef?: (ref: ForwardedRef<HTMLInputElement>) => void;

  disabled?: boolean;
};

const isStringEmpty = (str: string): boolean => str.trim().length === 0;

function SearchBar({
  form,
  name = 'query',
  onClick = () => { },
  onTouchEnd = () => { },
  onSearch = () => { },
  onClear = () => { },
  placeholder = '',
  onChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  onMountRef = () => { },
  disabled = false,
  ...args
}: SearchBarProps, ref: ForwardedRef<HTMLInputElement>) {
  const [content, setContent] = useState<string>('');
  const [focusSearch, setFocusSearch] = useState(false);
  const myRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    ref = myRef;

    if (!myRef || !myRef.current) return;
    onMountRef(myRef);
  }, []);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setContent(evt.target.value);
    onChange(evt)
  };
  const handleClear = (evt: MouseEvent<HTMLSpanElement>) => {
    setContent('');
    onClear(evt);
  };

  const handleFocus = (evt: FocusEvent<HTMLInputElement>) => {
    setFocusSearch(true);
    onFocus(evt);
  };

  const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
    setFocusSearch(false);
    onBlur(evt);
  }

  return (
    <div className={clsx("flex flex-1", {
      "border-solid border-[1px] border-light-green rounded-[2px]": focusSearch,
    })}>

      <BaseInput
        {...args}
        autoComplete='off'
        autoCapitalize='off'
        aria-autocomplete='none'
        inputRef={(inputRef) => {
          myRef.current = inputRef
          if (!ref) return;
          ref.current = inputRef
        }}
        fullWidth
        placeholder={placeholder}
        size='small'
        value={content}
        name={name}
        onClick={onClick}
        onTouchEnd={onTouchEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        disabled

        rightaddon={
          <>
            {
              !isStringEmpty(content) && (
                <span
                  className="cursor-pointer p-[10px]"
                  onClick={handleClear}
                >
                  <ClearIcon color='action' />
                </span>
              )
            }

            <button
              disabled
              form={form}
              type='submit'
              onClick={(evt: MouseEvent<HTMLButtonElement>) => {
                if (isStringEmpty(content)) {
                  return;
                }
                onSearch(content, evt)
              }}
              className="cursor-pointer absolute right-0 h-full
                flex items-center justify-center border-solid border-[1px] border-[#707070]
              bg-[#707070] py-2 px-3
              "
            >
              <span className="capitalize text-white text-sm">
                search
              </span>
            </button>
          </>
        }
      />
    </div>
  );
}

export default forwardRef(SearchBar);