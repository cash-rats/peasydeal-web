import {
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import { createAutocomplete } from '@algolia/autocomplete-core';
import type {
  AutocompleteOptions,
  AutocompleteState,
} from '@algolia/autocomplete-core'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { MdClear as ClearIcon } from 'react-icons/md';
import { BiSearch as SearchIcon } from 'react-icons/bi';

import { ALGOLIA_INDEX_NAME, DOMAIN } from '~/utils/get_env_source';
import { searchClient } from '~/components/Algolia';
import { createCategoriesPlugin } from '~/components/Algolia/plugins/createCategoriesPlugin';
import type { ProductQuerySuggestHit } from '~/components/Algolia/types';

import CategoryHits from './CategoryHits';
import type { AutocompleteItem } from './types';
import ProductHits from './ProductHits';
import RecentSearchHits from './RecentSearchHits';

/*
 * @TODOs:
 *  - [x] query suggets
 *  - [x] categories results
 *  - [x] categories title
 *  - [x] collection order, category suggests should go after query suggests.
 *  - [x] Add recent search items
 *  - [x] Redirect recent search to search page
 *  - [ ] Press enter redirect to search page
 *  - [ ] query suggests
 *  - [ ] poppular search
 *  - [ ] hit enter or search icon redirect to search page.
 */
export default function Autocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>
) {
  // const [state, dispatch] = useReducer(
  //   reducer,
  //   {
  //     autoCompleteState: {
  //       activeItemId: null,
  //       collections: [],
  //       completion: null,
  //       context: {},
  //       isOpen: false,
  //       query: '',
  //       status: 'idle'
  //     },
  //   },
  // );
  const [
    autocompleteState,
    setAutocompleteState,
  ] = useState<AutocompleteState<AutocompleteItem>>({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  });

  const recentSearchPlugin = useMemo(() => {
    return createLocalStorageRecentSearchesPlugin({
      key: 'products-recent-search',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          getItemUrl({ item }) {
            return `${DOMAIN}/search?query=${item.label}`;
          },
        };
      }
    });
  }, []);

  const querySuggestionPlugin = useMemo(() => {
    return createQuerySuggestionsPlugin<ProductQuerySuggestHit>({
      searchClient,
      indexName: ALGOLIA_INDEX_NAME,
      getSearchParams() {
        return recentSearchPlugin.data?.getAlgoliaSearchParams({
          hitsPerPage: 5,
        });
      },
      transformSource({ source }) {
        return {
          ...source,
          getItemUrl({ item }) {
            console.log('debug ** ~~ ', item.title);
            return `${DOMAIN}/search?query=${item.title}`
          },
        };
      },
    });
  }, [props]);


  const categoriesPlugin = useMemo(() => {
    return createCategoriesPlugin({ searchClient });
  }, [props]);

  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        onStateChange({ state }) {
          setAutocompleteState(state);
        },
        insights: true,
        plugins: [
          querySuggestionPlugin,
          recentSearchPlugin,
          categoriesPlugin,
        ],
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
        ...props,
      }),
    [
      props,
      querySuggestionPlugin,
      recentSearchPlugin,
      categoriesPlugin,
    ]
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
  }, [getEnvironmentProps, autocompleteState.isOpen]);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        ref={formRef}
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            <button className="aa-SubmitButton" type="submit" title="Submit">
              <SearchIcon />
            </button>
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
          />
        </div>
        <div className="aa-InputWrapperSuffix">
          <button className="aa-ClearButton" title="Clear" type="reset">
            <ClearIcon />
          </button>
        </div>
      </form>

      <div
        ref={panelRef}
        {...autocomplete.getPanelProps({})}
      >
        <div className="p-2">
          {
            autocompleteState
              .collections.map((collection, index) => {
                const { source, items } = collection;

                // console.log('debug collection', index, collection);
                // console.log('debug source', index, source);
                // console.log('debug items', index, items);

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
                  // console.log('debug recentSearchesPlugin', items);
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
                      state={autocompleteState}
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
  );
}
