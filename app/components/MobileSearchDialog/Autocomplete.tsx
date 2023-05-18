import {
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import {
  createAutocomplete,
} from '@algolia/autocomplete-core';
import type {
  AutocompleteOptions,
  AutocompleteState,
} from '@algolia/autocomplete-core'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import type { Hit } from '@algolia/client-search';
import { MdClear as ClearIcon } from 'react-icons/md';
import { BiSearch as SearchIcon } from 'react-icons/bi';

import { ALGOLIA_INDEX_NAME } from '~/utils/get_env_source';
import type { AlgoliaIndexItem } from '~/components/Algolia/types';
import { searchClient } from '~/components/Algolia';

import ProductHit from './ProductHit';

type AutocompleteItem = Hit<AlgoliaIndexItem>;

/*
 *  - [ ] query suggest header
 *  - [ ] categories results
 *  - [ ] categories title
 */
export default function Autocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>
) {
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<AutocompleteItem>
  >({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  });
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
        getSources() {
          return [
            {
              sourceId: 'products',
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: ALGOLIA_INDEX_NAME,
                      query,
                      params: {
                        hitsPerPage: 5,
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.url;
              },
            },
          ];
        },
        ...props,
      }),
    [props]
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
        {/* <div className="aa-PanelLayout aa-Panel--scrollable"> */}
        <div className="p-2">
          {autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;

            console.log('debug source', source);

            return (
              <section key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {
                      items
                        .map((item) =>
                          <ProductHit
                            key={item.objectID}
                            autocomplete={autocomplete}
                            item={item}
                            source={source}
                          />
                        )
                    }
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
