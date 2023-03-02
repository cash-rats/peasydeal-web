import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent, MutableRefObject } from 'react';
import { VscArrowLeft } from "react-icons/vsc";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { Link } from '@remix-run/react';

import MoonLoader from 'react-spinners/MoonLoader';
import { CgSearchFound } from 'react-icons/cg';

import SearchBar from '~/components/SearchBar';
import { rootNode } from '~/utils/trie';
import { composeProductDetailURL } from '~/utils';
import type { SuggestItem, ItemData } from '~/shared/types';

import Louple from './images/loupe.png';

type SearchingState = 'empty' | 'searching' | 'done' | 'error';

interface MobileSearchDialogProps {
  onBack?: () => void;

  items?: SuggestItem[];

  // Emit search request when user done typing keyword.
  onTypeSearch?: (query: string) => Promise<SuggestItem[]>

  // Emit search request when search button is clicked in mobile layout.
  onClickMobileSearch?: () => void;

  // Emit search request when hit enter in mobile layout.
  onEnterMobileSearch?: () => void;

  // Invoke when user clicks on magnifier.
  onSearch?: (query: string) => void;

  // Invoke if query does not exist in trie cache.
  onSearchRequest?: (query: string) => Promise<SuggestItem[]>;

  isOpen: boolean;
}

export default function MobileSearchDialog({
  onBack = () => { },
  onSearch = (query: string) => { },
  onSearchRequest = (query: string) => Promise.resolve([]),
  items = [],
  isOpen
}: MobileSearchDialogProps) {
  const [sugguests, setSuggests] = useState<SuggestItem[]>([]);
  const [showSuggests, setShowSuggests] = useState(false);
  const btnRef = useRef(null);
  const [searchingState, setSearchingState] = useState<SearchingState>('empty');
  const [searchContent, setSearchContent] = useState('');
  let inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSuggests(
      items.length === 0
        ? []
        : items
    );

    setSearchingState('done');

    items.forEach(({ title, data }) => {
      rootNode.populatePrefixTrie<ItemData>(title, data);
    });
  }, [JSON.stringify(items)]);

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    if (timerRef && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }

    setSearchContent(evt.target.value);

    if (!evt.target.value) {
      setShowSuggests(false);

      if (timerRef && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }

      return;
    }

    setSearchingState('searching');

    const matches = rootNode.findAllMatchedWithData(evt.target.value);

    if (evt.target.value.length < searchContent.length) {
      setSuggests(matches.map(match => match.data));
      setSearchingState('done');

      return;
    }

    // User increases search content, If matches are found in trie increase it.
    if (matches.length > 0) {
      setSuggests(matches);
      setSearchingState('done');
      setShowSuggests(true);

      return;
    }

    // Otherwise... we seek help from BE.
    timerRef.current = setTimeout(async () => {
      try {
        timerRef.current = undefined;
        const items = await onSearchRequest(evt.target.value);

        if (items.length > 0) {
          items.forEach(({ title, data }) => {
            rootNode.populatePrefixTrie<ItemData>(title, data);
          });
        }

        setSuggests(items);
        setShowSuggests(true);
        setSearchingState('done');
      } catch (error) {
        setSearchingState('error');
      }

    }, 700);
  }, []);

  const handleClear = useCallback(() => {
    setSearchContent('');
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query) return;

    onBack();
    onSearch(query);
  }, []);


  const handleEnter = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' || evt.keyCode === 13) {
      const elem = evt.target as HTMLInputElement;
      if (!elem.value) return;
      onBack();
      onSearch(elem.value);
    }
  }

  useEffect(() => {
    return () => inputRef?.current?.addEventListener('keypress', handleEnter);
  }, []);


  const handleOnMountRef = (ref: MutableRefObject<HTMLInputElement | null>) => {
    if (!ref) return;
    inputRef = ref;
    inputRef?.current?.addEventListener('keypress', handleEnter);
  }

  return (
    <Modal
      finalFocusRef={btnRef}
      scrollBehavior="inside"
      size="full"
      onClose={onBack}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <div>
            <div className="p-2 flex justify-end">
              <IconButton
                aria-label='Back'
                onClick={onBack}
                icon={<VscArrowLeft style={{ fontSize: '32px' }} />}
              />

              <div className="w-full ml-[10px]">
                <SearchBar
                  ref={inputRef}
                  placeholder='Search a product by name'
                  onChange={handleChange}
                  onClear={handleClear}
                  onSearch={handleSearch}
                  onMountRef={handleOnMountRef}
                />
              </div>
            </div>

            <div className="mt-4">
              {
                searchContent && (
                  <div className="grid grid-cols-2">
                    <p className="py-2 px-4 flex justify-start items-center">
                      Searching {searchContent}
                    </p>
                    <span className="py-2 px-4 flex justify-end items-center">
                      {
                        searchingState === 'searching'
                          ? <MoonLoader size={20} color="#009378" />
                          : (
                            searchingState === 'done' && sugguests.length === 0
                              ? <img alt='no product found' src={Louple} width={24} height={24} />
                              : <CgSearchFound fontSize={24} color='#009378' />

                          )
                      }
                    </span>
                  </div>
                )
              }

              {
                showSuggests && (
                  <ul className="list-none p-0 m-0">
                    {
                      sugguests.length === 0 && searchingState === 'done'
                        ? <p className="m-0 py-2 px-4 font-medium text-center capitalize">
                          no results found
                        </p>
                        : (
                          sugguests.map((suggest) => {
                            return (
                              <Link
                                key={suggest.data.productID}
                                to={composeProductDetailURL({
                                  productName: suggest.data.title,
                                  productUUID: suggest.data.productID,
                                })}
                                onClick={(evt) => { onBack(); }}
                              >
                                <li className="
                                    py-3 px-4 cursor-pointer
                                    leading-5 flex justify-between items-center
                                    hover:bg-gray-hover-bg
                                  "
                                >
                                  {suggest.title}
                                </li>
                              </Link>
                            )
                          })
                        )
                    }
                  </ul>
                )
              }

            </div>
          </div>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
}