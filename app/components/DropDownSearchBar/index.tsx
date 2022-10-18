import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';

import styles from './styles/DropDownSearchBar.css';
import { rootNode } from './trie';

export const links: LinksFunction = () => {
  return [
    ...SearchBarLinks(),
    { href: styles, rel: 'stylesheet' },
  ];
}


type SearchingState = 'empty' | 'searching' | 'done' | 'error';

interface DropDownSearchBarProps {
  placeholder?: string;

  onDropdownSearch?: (query: string) => void;

  results?: string[];
}

// `DropDownSearchBar` is the extension of SearchBar. It displays list of suggestions in the dropdown box
//  when user is typing search text.
//
// 1. When user start typing, display dropdown list.
// 2. Debounce for 0.5s, once done debouncing, start search local trie to see if there is a match, If there is no matches,
//    query API for matches. During the process on searching, dropdown box will display: `searching product: ...`
// 3. When rerendered, update trie node with the result.
// 4. Display the result (either from local trie, or remote API) in dropdown box. don't forget to update local trie for the next search.
// 5. Hide dropdown list when is unfocused.
export default function DropDownSearchBar({
  placeholder = '',
  onDropdownSearch = () => { },
  results = []
}: DropDownSearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchingState, setSearchingState] = useState<SearchingState>('empty');
  const [searchContent, setSearchContent] = useState<string>('');
  const [suggests, setSuggests] = useState<string[]>([]);

  useEffect(() => {
    results.forEach((result) => {
      rootNode.populatePrefixTrie(result);
    });

    const matches = rootNode.findAllMatched(searchContent);

    setSuggests(matches);
    setSearchingState('done');
  }, [results]);


  const timerRef = useRef(undefined);
  const timeoutTimerRef = useRef(undefined);

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

      return;
    }

    setSearchingState('searching');

    const matches = rootNode.findAllMatched(evt.target.value);

    // If search query length is reducing, other than empty, there must exists matches in
    // trie we can display in dropdown
    if (evt.target.value.length < searchContent.length) {
      setSuggests(matches);

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
      timerRef.current = undefined;

      await onDropdownSearch(evt.target.value);

      setSearchingState('done');

      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }

      timeoutTimerRef.current = undefined;
    }, 700);

    // I'll wait for 2.5s. If no dropdown results coming back, it's a timeout
    // then i'll cancel onDropdownSearch
    timeoutTimerRef.current = setTimeout(() => {
      timeoutTimerRef.current = undefined;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = undefined;
      setSearchingState('done');
      setSuggests([]);
    }, 2500);
  }, [])

  const handleBlur = () => {
    setShowDropdown(false);
  };

  const handleFocus = () => {
    // show dropdown list only if we have matches in trie.
    const matches = rootNode.findAllMatched(searchContent);

    // TODO: show most recent search.
    // if user has not enter any search content, we don't show dropdown.
    if (!searchContent) return;

    if (matches.length > 0) {
      setShowDropdown(true);
    }
  }

  return (
    <Form className="DropDownSearchBar__wrapper">
      <SearchBar
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
      />

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
                suggests.map((result, index) => {
                  return (
                    <li key={index} className="DropDownSearchBar__dropdown-item">
                      <a>
                        <p> {result} </p>
                      </a>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        )
      }
    </Form>
  );
};