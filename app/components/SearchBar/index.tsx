import type { MouseEvent } from 'react';
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
  onSearch?: (evt: MouseEvent<HTMLSpanElement>) => void;
}

function SearchBar({ onSearch = () => { }, ...args }: SearchBarProps) {
  return (
    <div className="nav-search-box">
      <div className="search-box">
        <InputBase
          fullWidth
          placeholder="Search order number"
          size='small'
        />

        <span
          onClick={onSearch}
          className="search-icon"
        >
          <SearchIcon />
        </span>
      </div>
    </div>
  );
}

export default SearchBar