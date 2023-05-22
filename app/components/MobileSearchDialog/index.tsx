import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { VscArrowLeft } from "react-icons/vsc";
import { useNavigation, useSubmit } from '@remix-run/react';
import type {
  BaseSyntheticEvent,
  MouseEvent,
  KeyboardEvent
} from 'react';
import { createAutocomplete } from '@algolia/autocomplete-core';
import insightsClient from 'search-insights';

import type { AutocompleteItem } from '~/components/Algolia/types';
import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from '~/components/Algolia/plugins';
import { searchClient } from '~/components/Algolia';
import {
  CategoryHits,
  ProductHits,
  RecentSearchHits,
} from '~/components/Algolia';
import { ALGOLIA_APP_ID, ALGOLIA_APP_WRITE_KEY } from '~/utils/get_env_source';

import reducer, { setAutoCompleteState } from './reducer';
import SearchBar from './SearchBar';

insightsClient(
  'init', {
  appId: ALGOLIA_APP_ID,
  apiKey: ALGOLIA_APP_WRITE_KEY,
});

interface MobileSearchDialogProps {
  onBack?: () => void;

  isOpen: boolean;
}

function MobileSearchDialog({
  isOpen = false,
  onBack = () => { },
}: MobileSearchDialogProps) {
  const navigate = useNavigation();
  const submitSearch = useSubmit();

  const [state, dispatch] = useReducer(
    reducer,
    {
      autoCompleteState: {
        collections: [],
        completion: null,
        context: {},
        isOpen: false,
        query: '',
        activeItemId: null,
        status: 'idle',
      },
    },
  );

  const recentSearchPlugin = useMemo(() => {
    return createRecentSearchPlugin();
  }, []);

  const productsSuggestionsPlugin = useMemo(() => {
    return createProductsSuggestionsPlugin({
      searchClient,
      recentSearchPlugin,
    });
  }, [recentSearchPlugin]);

  const categoriesPlugin = useMemo(() => {
    return createCategoriesPlugin({ searchClient })
  }, []);


  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        BaseSyntheticEvent,
        MouseEvent,
        KeyboardEvent
      >({
        openOnFocus: true,
        autoFocus: true,
        onStateChange({ state }) {
          dispatch(setAutoCompleteState(state));
        },
        onSubmit({ state }) {
          console.log('debug submit search', state.query);
          submitSearch(
            { query: state.query },
            {
              method: 'post',
              action: '/search?index',
            },
          );
        },
        insights: { insightsClient },
        navigator: {
          navigate({ itemUrl }) {
            window.location.assign(itemUrl);
          },

          navigateNewTab({ itemUrl }) {
            const windowReference = window.open(itemUrl, '_blank', 'noopener');

            if (windowReference) {
              windowReference.focus();
            }
          },

          navigateNewWindow({ itemUrl }) {
            window.open(itemUrl, '_blank', 'noopener');
          },
        },
        plugins: [
          productsSuggestionsPlugin,
          recentSearchPlugin,
          categoriesPlugin,
        ]
      }),
    []
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { getEnvironmentProps } = autocomplete;

  useEffect(() => {
    if (!formRef.current || !panelRef.current || !inputRef.current) {
      return undefined;
    }

    const { onTouchStart, onTouchMove, onMouseDown } = getEnvironmentProps({
      formElement: formRef.current,
      inputElement: inputRef.current,
      panelElement: panelRef.current,
    });

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);

    };
  }, [
    getEnvironmentProps,
    state.autoCompleteState.isOpen,
  ]);

  useEffect(() => {
    if (navigate.state === 'submitting') {
      onBack();
    }

    return () => {
      onBack();
    }
  }, [navigate.state]);

  return (
    <Modal
      scrollBehavior='inside'
      size='full'
      isOpen={isOpen}
      onClose={onBack}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <div {...autocomplete.getRootProps({})}>
            <div className="p-2 flex justify-end">

              {/* Back Button */}
              <IconButton
                aria-label='Back'
                onClick={onBack}
                icon={<VscArrowLeft style={{ fontSize: '32px' }} />}
              />

              {/* Autocomplete search bar */}
              <div className="w-full ml-[10px]">
                <SearchBar
                  autocomplete={autocomplete}
                  formRef={formRef}
                  inputRef={inputRef}
                  state={state.autoCompleteState}
                />
              </div>
            </div>

            {/* Dropdown suggestions */}
            <div
              ref={panelRef}
              {...autocomplete.getPanelProps({})}
            >
              <div className="p-2">
                {
                  state
                    .autoCompleteState
                    .collections.map((collection, index) => {
                      const { source, items } = collection;

                      if (source.sourceId === 'querySuggestionsPlugin') {
                        return (
                          <ProductHits
                            key={source.sourceId}
                            autocomplete={autocomplete}
                            items={items}
                            source={source}
                          />
                        );
                      }

                      if (source.sourceId === 'recentSearchesPlugin') {
                        return (
                          <RecentSearchHits
                            key={source.sourceId}
                            autocomplete={autocomplete}
                            items={items}
                            source={source}
                          />
                        );
                      }

                      // @TODO: Assert type to CategoryRecord instead of AgoliaIndexItem
                      if (source.sourceId === 'categoriesPlugin') {
                        return (
                          <CategoryHits
                            key={source.sourceId}
                            source={source}
                            items={items}
                            autocomplete={autocomplete}
                          />
                        )
                      }

                      return null
                    })}
              </div>
            </div>

          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileSearchDialog;