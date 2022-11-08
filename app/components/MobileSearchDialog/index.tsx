import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchBar from '~/components/SearchBar';
import { rootNode } from '~/utils/trie';

import styles from './styles/MobileSearchDialog.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type SearchingState = 'empty' | 'searching' | 'done' | 'error';

type ItemData = {
  title: string;
  image: string;
  discount: number;
  productID: string;
};

export type SuggestItem = {
  title: string;
  data: ItemData;
};

interface MobileSearchDialogProps extends DialogProps {
  onBack?: () => void;

  // useSearchSuggests?: () => [SuggestItem[], SearchSuggest];

  items?: SuggestItem[];

  onSearchRequest?: (query: string) => void;
}

export default function MobileSearchDialog({
  onBack = () => { },
  onSearchRequest = (query: string) => ([]),
  items = [],
  ...args
}: MobileSearchDialogProps) {
  const [sugguests, setSuggests] = useState<SuggestItem[]>(items);
  const [showSuggests, setShowSuggests] = useState(false);
  const [searchingState, setSearchingState] = useState<SearchingState>('empty');
  const [searchContent, setSearchContent] = useState('');

  useEffect(() => {
    // if (searchingState === 'empty') return;
    console.log('trigger set suggest');

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

  // const resetTimer = useCallback((timerRef) => {
  //   timerRef

  // }, [])

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

    setShowSuggests(true);

    setSearchingState('searching');

    const matches = rootNode.findAllMatchedWithData(evt.target.value);

    // User increases search content, If matches are found in trie increase it.
    if (matches.length > 0) {
      setSuggests(matches);
      setSearchingState('done');

      return;
    }

    // Otherwise... we seek help from BE.
    timerRef.current = setTimeout(async () => {
      try {
        timerRef.current = undefined;
        console.log('debug 1');
        await onSearchRequest(evt.target.value);
      } catch (error) {
        setSearchingState('error');
      }

    }, 700);
  }, []);

  return (
    <Dialog
      fullScreen
      {...args}
    >
      <div className="SearchDialog__wrapper">
        <div className="MobileSearch__wrapper">
          <IconButton onClick={onBack} >
            <ArrowBackIcon fontSize='32' />
          </IconButton>

          <div className="MobileSearch__searchbar">
            <SearchBar
              placeholder='Search a product by name'
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="MobileSearch__result-wrapper">
          <ul className="MobileSearch__result-list">
            {
              showSuggests && (
                sugguests.map((suggest) => {
                  return (
                    <Link key={suggest.data.productID} to={`/product/${suggest.data.productID}`} >
                      <li
                        className="MobileSearch__result-item"
                      >
                        {suggest.title}
                      </li>
                    </Link>
                  )
                })
              )
            }
          </ul>
        </div>
      </div>
    </Dialog>
  );
}