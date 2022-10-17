import type { MouseEvent, ChangeEvent, FocusEvent } from 'react';
import { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import clsx from 'clsx';

import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SearchBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SearchBarProps {
  onSearch?: (orderNum: string, evt: MouseEvent<HTMLSpanElement>) => void;

  onClear?: (evt: MouseEvent<HTMLSpanElement>) => void;

  // When search content changes
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;

  // When search input is focused
  onFocus?: (evt: FocusEvent<HTMLInputElement>) => void;

  // When search input is blurred
  onBlur?: (evt: FocusEvent<HTMLInputElement>) => void;

  placeholder?: string;
}

const isStringEmpty = (str: string): boolean => str.trim().length === 0;

function SearchBar({
  onSearch = () => { },
  onClear = () => { },
  placeholder = '',
  onChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  ...args
}: SearchBarProps) {
  const [content, setContent] = useState<string>('');
  const [focusSearch, setFocusSearch] = useState(false);
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
    <div className={clsx("nav-search-box", {
      "SearchBar__focus": focusSearch,
    })}>
      <div className="search-box">
        <InputBase
          fullWidth
          placeholder={placeholder}
          size='small'
          value={content}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        {
          !isStringEmpty(content) && (
            <span
              className="clear-icon"
              onClick={handleClear}
            >
              <ClearIcon color='action' />
            </span>
          )
        }

        <button
          type='submit'
          onClick={(evt) => {
            if (isStringEmpty(content)) {
              return;
            }
            onSearch(content, evt)
          }}
          className="search-icon"
        >
          <SearchIcon color={
            isStringEmpty(content)
              ? 'disabled'
              : 'action'
          } />
        </button>
      </div>
    </div>
  );
}

export default SearchBar