import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';

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

  onDropdownSearch?: (query: string) => void;

  results?: SuggestItem[];

  action?: string;
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
  results = [],
}: DropDownSearchBarProps) {
  console.log('debug cool', results);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchingState, setSearchingState] = useState<SearchingState>('empty');
  const [searchContent, setSearchContent] = useState<string>('');
  const [suggests, setSuggests] = useState<SuggestItem[]>(results);
  const dropdownListRef = useRef<HTMLDivElement>();

  // @see https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
  useEffect(() => {
    if (!document) return;

    const handleBodyClick = (evt) => {
      if (!dropdownListRef || !dropdownListRef.current) return;

      if (dropdownListRef.current !== evt.target && !dropdownListRef.current.contains(evt.target)) {
        console.log('clicking outside the div');
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleBodyClick);
    return () => window.removeEventListener('click', handleBodyClick);
  }, []);

  useEffect(() => {
    console.log('debug', results);

    if (results.length === 0) {
      setSuggests([]);

      return;
    }

    setSuggests(results);
    setSearchingState('done');

    results.forEach(({ title, data }) => {
      rootNode.populatePrefixTrie<ItemData>(title, data);
    });
  }, [results, results.length]);


  const timerRef = useRef(undefined);
  // const timeoutTimerRef = useRef(undefined);

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setSearchContent(evt.target.value);
    setShowDropdown(true);

    // If search content is empty, hide dropdown.
    if (!evt.target.value) {
      setSuggests([]);
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
        setSearchingState('done');
      } catch (error) {
        setSearchContent('error');
      }
    }, 700);
  }, [])

  const handleFocus = () => {
    // show dropdown list only if we have matches in trie.
    const matches = rootNode.findAllMatchedWithData(searchContent);

    // if user has not enter any search content, we don't show dropdown.
    if (!searchContent) return;

    if (matches.length > 0) {
      setShowDropdown(true);
    }
  }

  return (
    <div ref={dropdownListRef} className="DropDownSearchBar__wrapper" >
      <SearchBar
        onFocus={handleFocus}
        // onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <input name='__action' type='hidden' value='query_products' />
      <input name='query' type='hidden' value={searchContent} />

      {
        showDropdown && (
          <div className="DropDownSearchBar__dropdown-wrapper">
            {
              searchContent && (
                <p className="DropDownSearchBar__dropdown-content">
                  Searching {searchContent}
                </p>
              )
            }

            <ul className="DropDownSearchBar__dropdown-list">
              {
                suggests.map((suggest, index) => {
                  return (
                    <Link onClick={(evt) => { }} key={index} to={`/product/${suggest.data.productID}`}>
                      <div className="DropDownSearchBar__dropdown-item">
                        <p>  {suggest.data.title}  </p>
                        <span className="DropDownSearchBar__dropdown-discount"> SAVE {
                          (Number(suggest.data.discount) * 100).toFixed(0)
                        }%</span>
                      </div>
                    </Link>
                  );
                })
              }
            </ul>
          </div>
        )
      }
    </div>
  );
};