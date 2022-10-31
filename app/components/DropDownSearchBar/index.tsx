import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import MoonLoader from 'react-spinners/MoonLoader';
import { CgSearchFound } from 'react-icons/cg';

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';
import useBodyClick from '~/hooks/useBodyClick';

import styles from './styles/DropDownSearchBar.css';
import { rootNode } from './trie';

export const links: LinksFunction = () => {
  return [
    ...SearchBarLinks(),
    { href: styles, rel: 'stylesheet' },
  ];
};

type SearchingState = 'empty' | 'searching' | 'done' | 'error';

export type ItemData = {
  title: string;
  image: string;
  discount: number;
  productID: string;
};

export type SuggestItem = {
  title: string;
  data: ItemData;
};

interface DropDownSearchBarProps {
  placeholder?: string;

  onSearch?: (query: string) => void;

  onDropdownSearch?: (query: string) => void;

  results?: SuggestItem[];
}

// `DropDownSearchBar` is the extension of SearchBar. It displays list of suggestions in the dropdown box
//  when user is typing search text.
//
//  It has it's own action to handle API requesting.
//
// 1. When user start typing, display dropdown list.
// 2. Debounce for 0.5s, once done debouncing, start search local trie to see if there is a match, If there is no matches,
//    query API for matches. During the process on searching, dropdown box will display: `searching product: ...`
// 3. When rerendered, update trie node with the result.
// 4. Display the result (either from local trie, or remote API) in dropdown box. don't forget to update local trie for the next search.
// 5. Hide dropdown list when is unfocused.
//
// TODOs:
//  - show most recent search.
//  - have timeout mechanism.
export default function DropDownSearchBar({
  placeholder = '',
  onDropdownSearch = () => { },
  onSearch = () => { },
  results = [],
}: DropDownSearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchingState, setSearchingState] = useState<SearchingState>('empty');
  const [searchContent, setSearchContent] = useState<string>('');
  const [suggests, setSuggests] = useState<SuggestItem[]>(results);
  const dropdownListRef = useRef<HTMLDivElement | null>(null);

  // @see https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
  // Hide dropdown list if user clicks outside of the dropdown area.
  useBodyClick((evt: MouseEvent) => {
    if (!dropdownListRef || !dropdownListRef.current) return;

    if (dropdownListRef.current !== evt.target && !dropdownListRef.current.contains(evt.target)) {
      setShowDropdown(false);
    }
  });

  const searchInputRef = useRef<HTMLInputElement | undefined>(undefined);

  useEffect(() => {
    const handleEnter = () => {
      setShowDropdown(false);
      searchInputRef?.current?.blur();
    }

    if (!searchInputRef || !searchInputRef.current) return;
    const inputRef = searchInputRef.current;
    inputRef.addEventListener('keypress', handleEnter);

    return () => inputRef.addEventListener('keypress', handleEnter);
  }, []);

  useEffect(() => {
    if (searchingState === 'empty') return;

    setSuggests(
      results.length === 0
        ? []
        : results
    );
    setSearchingState('done');

    results.forEach(({ title, data }) => {
      rootNode.populatePrefixTrie<ItemData>(title, data);
    });
  }, [results, results.length]);


  const timerRef = useRef(undefined);

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setSearchContent(evt.target.value);
    setShowDropdown(true);

    // If search content is empty, hide dropdown.
    if (!evt.target.value) {
      setShowDropdown(false);

      if (timerRef) {
        clearTimeout(timerRef.current);
      }

      return;
    }

    setSearchingState('searching');

    const matches = rootNode.findAllMatchedWithData(evt.target.value);

    // If search query length is reducing, other than empty, there must exists matches in
    // trie we can display in dropdown
    if (evt.target.value.length < searchContent.length) {
      setSuggests(matches.map(match => match.data));
      setSearchingState('done');

      return;
    }

    // User increases the characters of search content. if there are matches found in trie cache,
    // we display the cached matches from trie.
    if (matches.length > 0) {
      setSuggests(matches);
      setSearchingState('done');

      return;
    }

    // User type more characters in search content but no matches found in trie cache.
    // we need to do some operation to fetch more results. Only perform search when use finish typing.
    timerRef.current = setTimeout(async () => {
      try {
        timerRef.current = undefined;
        await onDropdownSearch(evt.target.value);
      } catch (error) {
        setSearchContent('error');
      }
    }, 700);
  }, [])

  const handleFocus = () => {
    // if user has not enter any search content, we don't show dropdown.
    if (!searchContent) return;

    if (suggests.length > 0) {
      setShowDropdown(true);
    }
  }

  return (
    <div ref={dropdownListRef} className="DropDownSearchBar__wrapper" >
      <SearchBar
        ref={searchInputRef}
        onSearch={onSearch}
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {
        showDropdown && (
          <div className="DropDownSearchBar__dropdown-wrapper">
            {
              searchContent && (
                <div className="DropDownSearchBar__dropdown-search-status">
                  <p className="DropDownSearchBar__dropdown-content">
                    Searching {searchContent}
                  </p>
                  <span className="DropDownSearchBar__dropdown-state"> {
                    searchingState === 'searching'
                      ? <MoonLoader size={20} color="#009378" />
                      : <CgSearchFound fontSize={24} color='#009378' />
                  } </span>
                </div>
              )
            }

            <ul className="DropDownSearchBar__dropdown-list">
              {
                suggests.length === 0 && searchingState === 'done'
                  ? <p className="DropDownSearchBar__dropdown-list-no-found">no result found</p>
                  : (
                    suggests.map((suggest, index) => {
                      return (
                        <Link
                          onClick={(evt) => { setShowDropdown(false); }}
                          key={index}
                          to={`/product/${suggest.data.productID}`}
                        >
                          <div className="DropDownSearchBar__dropdown-item">
                            <p>  {suggest.data.title}  </p>
                            <span className="DropDownSearchBar__dropdown-discount"> SAVE {
                              (Number(suggest.data.discount) * 100).toFixed(0)
                            }%</span>
                          </div>
                        </Link>
                      );
                    })
                  )
              }
            </ul>
          </div>
        )
      }
    </div>
  );
};