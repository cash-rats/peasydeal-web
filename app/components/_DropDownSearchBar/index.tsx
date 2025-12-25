import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { LinksFunction } from 'react-router';
import { Link } from 'react-router';
import MoonLoader from 'react-spinners/MoonLoader';
import { CgSearchFound } from 'react-icons/cg';
import { BsArrowRightShort } from 'react-icons/bs';
import { Spinner } from '@chakra-ui/react'

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';
import useBodyClick from '~/hooks/useBodyClick';
import { rootNode } from '~/utils/trie';
import { composeProductDetailURL } from '~/utils';
import type { ItemData, SuggestItem } from '~/shared/types';
import { trackEvent } from '~/lib/gtm';


export const links: LinksFunction = () => {
  return [
    ...SearchBarLinks(),
  ];
};

export type SearchingState = 'empty' | 'searching' | 'done' | 'error';


interface DropDownSearchBarProps {
  form?: string | undefined;

  placeholder?: string;

  onSearch?: (query: string, evt: MouseEvent<HTMLElement>) => void;

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
//  - [ ] show most recent search.
//  - [ ] have timeout mechanism.
//  - [ ] outer ref is often undefined.
function DropDownSearchBar({
  form,
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
    const handleEnter = (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') {
        setShowDropdown(false);
        const elem = evt.target as HTMLElement;
        elem?.blur();
      }
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


  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
        trackEvent('search_auto_complete', {
          query: evt.target.value,
          layout: 'full',
        });
        timerRef.current = undefined;
        await onDropdownSearch(evt.target.value);
      } catch (error) {
        setSearchingState('error');
      }
    }, 700);
  }, [])

  const handleFocus = () => {
    // if user has not enter any search content, we don't show dropdown.
    // if (!searchContent) return;

    if (suggests.length > 0) {
      setShowDropdown(true);
    }
  }

  const handleViewAllResults = (evt: MouseEvent<HTMLDivElement>) => {
    trackEvent('click_search_view_all_result');

    setShowDropdown(false);
    onSearch(searchContent, evt);
  }

  return (
    <div ref={dropdownListRef} className="w-full relative z-2" >
      <SearchBar
        form={form}
        ref={searchInputRef}
        onSearch={onSearch}
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {
        showDropdown && (
          <div className="
            py-2 px-0 mt-1
            bg-[white] rounded-lg shadow-[dropdown]
            absolute w-full z-10
            border-solid border-[1px] border-header-border
          ">
            {
              searchContent && (
                <div className="grid grid-cols-2">
                  <p className="
                    py-2 px-4
                    flex flex-start items-center
                    font-poppins
                  ">
                    Searching {searchContent}
                  </p>
                  <span className="py-2 px-4 flex justify-end items-center"> {
                    searchingState === 'searching'
                      ? <MoonLoader size={20} color="#009378" />
                      : <CgSearchFound fontSize={24} color='#009378' />
                  } </span>
                </div>
              )
            }

            <ul className="list-none p-0 m-0">
              {
                suggests.length === 0 && searchingState === 'done'
                  ? <p className="
                      m-0 py-2 px-4
                      font-medium text-center capitalize font-poppins
                    ">
                    no result found
                  </p>
                  : (
                    suggests.map((suggest, index) => {
                      return (
                        <Link
                          onClick={(evt) => { setShowDropdown(false); }}
                          key={index}
                          to={composeProductDetailURL({
                            productUUID: suggest.data.productID,
                            productName: suggest.data.title,
                          })}
                        >
                          <li className="
                            py-2 px-4 cursor-pointer leading-5
                            grid grid-cols-2
                            hover:bg-gray-hover-bg
                          ">
                            <div className="flex flex-row">
                              <div>
                                <img
                                  className="w-[100px] h-[100px]"
                                  alt={suggest.data.title}
                                  src={suggest.data.image}
                                />
                              </div>
                              <div className="flex flex-col justify-center items-start ml-2 gap-2">
                                <span className="font-poppins text-[1.1rem] font-medium">
                                  {suggest.data.title}
                                </span>
                                {/* <span className="text-[1rem]">
                                  rating
                                </span> */}
                              </div>
                            </div>
                            <div className="flex justify-end items-end">
                              <span className="font-semibold font-poppins leading-6 text-price-off-red">
                                SAVE &nbsp;
                                {
                                  (Number(suggest.data.discount) * 100).toFixed(0)
                                }%
                              </span>
                            </div>
                          </li>
                        </Link>
                      );
                    })
                  )
              }
            </ul>

            {
              searchingState === 'searching' && (
                <div className='w-full flex items-center justify-center'>
                  <Spinner size='lg' />
                </div>
              )
            }

            {
              suggests.length > 0 && searchingState === 'done' && (
                <div
                  className="
                    py-1 hover:bg-gray-hover-bg
                    flex justify-center items-center
                    text-md font-medium uppercase font-poppins
                    cursor-pointer"
                  onClick={handleViewAllResults}
                >
                  view all results
                  <span className="ml-1">
                    <BsArrowRightShort fontSize={36} />
                  </span>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};

DropDownSearchBar.displayName = 'DropDownSearchBar';

export default DropDownSearchBar
