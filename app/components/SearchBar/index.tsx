import type { MouseEvent, ChangeEvent } from 'react';
import { useState } from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SearchBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SearchBarProps {
  onSearch?: (orderNum: string, evt: MouseEvent<HTMLSpanElement>) => void;
}

function SearchBar({ onSearch = () => { }, ...args }: SearchBarProps) {
  const [orderNum, setOrderNum] = useState<string>('');
  const handleChangeOrderNum = (evt: ChangeEvent<HTMLInputElement>) => {
    setOrderNum(evt.target.value);
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

        <span
          onClick={(evt) => onSearch(orderNum, evt)}
          className="search-icon"
        >
          <SearchIcon />
        </span>
      </div>
    </div>
  );
}

export default SearchBar