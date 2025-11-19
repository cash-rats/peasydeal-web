import type {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  MouseEvent,
  MutableRefObject,
  Ref,
  TouchEvent,
} from 'react';
import { forwardRef, useRef, useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import type { LinksFunction } from 'react-router';

import BaseInput from '~/components/BaseInput';
import styles from './styles/SearchBar.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SearchBarProps extends Omit<ComponentProps<'input'>, 'ref'> {
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

  onMountRef?: (ref: MutableRefObject<HTMLInputElement | null>) => void;

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
}: SearchBarProps, ref: Ref<HTMLInputElement | null>) {
  const [content, setContent] = useState<string>('');
  const [focusSearch, setFocusSearch] = useState(false);
  const myRef = useRef<HTMLInputElement | null>(null);
  const handleInputRef = (inputEl: HTMLInputElement | null) => {
    myRef.current = inputEl;

    if (typeof ref === 'function') {
      ref(inputEl);
    } else if (ref && typeof ref === 'object') {
      (ref as MutableRefObject<HTMLInputElement | null>).current = inputEl;
    }

    onMountRef?.(myRef);
  };

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
        ref={handleInputRef}
        placeholder={placeholder}
        value={content}
        name={name}
        onClick={onClick}
        onTouchEnd={onTouchEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        disabled={disabled}

        rightaddon={
          <>
            {
              !isStringEmpty(content) && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="flex items-center justify-center p-[10px] text-muted-foreground hover:text-foreground"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
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
