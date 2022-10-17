import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';

import styles from './styles/DropDownSearchBar.css';

export const links: LinksFunction = () => {
  return [
    ...SearchBarLinks(),
    { href: styles, rel: 'stylesheet' },
  ];
}

type SearchingState = 'empty' | 'searching' | 'done' | 'error';

interface DropDownSearchBarProps {
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
  onDropdownSearch = () => { },
  results = []
}: DropDownSearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchingState, setSearchingState] = useState<SearchingState>('empty');
  const [searchContent, setSearchContent] = useState<string>('');

  const [suggests, setSuggests] = useState<string[]>(results);


  let timer = undefined;

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!showDropdown) setShowDropdown(true);

    setSearchContent(evt.target.value);
    setSearchingState('searching');

    // If timer is not null, clear previous search operation
    if (timer) {
      clearTimeout(timer);
    }

    // Perform debounce here. Only perform search when use finish typing
    timer = setTimeout(() => {
      timer = undefined;
      onDropdownSearch(evt.target.value);

      // I'll wait for 0.8s. If no dropdown results coming back, it's a timeout
      // and i'm setting searching state to 'done'.
      // setTimeout(() => {
      //   setSearchingState('done');
      // }, 1500)
    }, 700);
  };

  const handleBlur = () => {
    setShowDropdown(false);
  };

  return (
    <Form className="DropDownSearchBar__wrapper">
      <SearchBar
        onBlur={handleBlur}
        onChange={handleChange}
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
                results.map((result, index) => {
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