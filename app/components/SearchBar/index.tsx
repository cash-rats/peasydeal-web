import type { MouseEvent, ChangeEvent } from 'react';
import { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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
}

const isStringEmpty = (str: string): boolean => str.trim().length === 0;

function SearchBar({ onSearch = () => { }, onClear = () => { }, ...args }: SearchBarProps) {
  const [orderNum, setOrderNum] = useState<string>('');
  const handleChangeOrderNum = (evt: ChangeEvent<HTMLInputElement>) => {
    setOrderNum(evt.target.value);
  };
  const handleClearOrderNum = (evt: MouseEvent<HTMLSpanElement>) => {
    setOrderNum('');
    onClear(evt);
  };

  return (
    <div className="nav-search-box">
      <div className="search-box">
        <InputBase
          fullWidth
          placeholder="Search order number"
          size='small'
          value={orderNum}
          onChange={handleChangeOrderNum}
        />

        {
          !isStringEmpty(orderNum) && (
            <span
              className="clear-icon"
              onClick={handleClearOrderNum}
            >
              <ClearIcon color='action' />
            </span>
          )
        }

        <span
          onClick={(evt) => {
            if (isStringEmpty(orderNum)) {
              return;
            }
            onSearch(orderNum, evt)
          }}
          className="search-icon"
        >
          <SearchIcon color={
            isStringEmpty(orderNum)
              ? 'disabled'
              : 'action'
          } />
        </span>
      </div>
    </div>
  );
}

export default SearchBar