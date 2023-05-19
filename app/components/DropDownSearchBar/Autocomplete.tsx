import { useMemo, useReducer } from 'react';
import type { AutocompleteOptions } from '@algolia/autocomplete-shared';
import { MdClear as ClearIcon } from 'react-icons/md';
import { BiSearch as SearchIcon } from 'react-icons/bi';
import type {
  BaseSyntheticEvent,
  MouseEvent,
  KeyboardEvent
} from 'react';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createAutocomplete } from '@algolia/autocomplete-core';

import { searchClient } from '~/components/Algolia';
import type { AutocompleteItem } from '~/components/Algolia/types';
import type { AlgoliaIndexItem } from '~/components/Algolia/types';
import { ProductHits } from '~/components/Algolia';

import reducer, { setAutoCompleteState } from './reducer';
import { useAttachAutocompleteKeyboardEvents } from './hooks';
// import { useCreateAutocomplete } from './hooks';

function Autocomplete(props: Partial<AutocompleteOptions<AlgoliaIndexItem>>) {
  console.log('debug props', props);
  // const containerRef = useRef(null);
  // const panelRootRef = useRef(null);
  // const rootRef = useRef(null);

  // useEffect(() => {
  //   if (!containerRef.current) {
  //     return undefined;
  //   }

  //   const search = autocomplete<AlgoliaIndexItem>({
  //     container: containerRef.current,
  //     // renderer: { createElement, Fragment, render: () => { } },
  //     // render({ children }, root) {
  //     //   if (!panelRootRef.current || rootRef.current !== root) {
  //     //     rootRef.current = root;

  //     //     panelRootRef.current?.unmount();
  //     //     panelRootRef.current = createRoot(root);
  //     //   }

  //     //   panelRootRef.current.render(children);
  //     // },
  //     ...props
  //   })

  //   return () => {
  //     search.destroy();
  //   }
  // }, [props]);
  // useMemo(() => {
  //   return createAutocomplete<
  //     AlgoliaIndexItem,
  //     BaseSyntheticEvent,
  //     MouseEvent,
  //     KeyboardEvent
  //   >({
  //     insights: true,
  //     plugins: props.plugins,
  //   });
  // }, [props])
  // return (<div ref={containerRef} />)

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

  const querySuggestionPlugin = useMemo(() => (
    createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'staging_products',
      // getSearchParams() {
      //   return recentSearchPlugin.data?.getAlgoliaSearchParams({
      //     hitsPerPage: 5,
      //   });
      // },
      transformSource({ source }) {
        return {
          ...source,
          getItemUrl({ item }) {
            return `http://localhost:3000/search?query=${item.title}`
          }
        };
      },
    })
  ), []);

  const autocomplete = useMemo(() => {
    return createAutocomplete<
      AutocompleteItem,
      BaseSyntheticEvent,
      MouseEvent,
      KeyboardEvent
    >({
      // insights: true,
      onStateChange({ state }) {
        // console.log('debug 1', state);
        dispatch(setAutoCompleteState(state));
      },
      plugins: [querySuggestionPlugin],
      ...props,
    });
  }, [props]);

  const { inputRef, formRef, panelRef } = useAttachAutocompleteKeyboardEvents(autocomplete);
  // const {
  //   autocomplete,
  //   state,
  //   formRef,
  //   inputRef,
  //   panelRef,
  // } = useCreateAutocomplete(props)

  return (
    <div
      className="aa-Autocompletel relative"
      {...autocomplete.getRootProps({})}
    >
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

      {state.autoCompleteState.isOpen && (
        <div
          ref={panelRef}
          className={[
            'aa-Panel',
            'aa-Panel--desktop',
            'w-full',
            state.autoCompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          <div className="aa-PanelLayout aa-Panel--scrollable">
            {
              state
                .autoCompleteState
                .collections
                .map((collection, index) => {
                  const { source, items } = collection;
                  if (source.sourceId === "querySuggestionsPlugin") {
                    console.log('debug 2*');
                    return (
                      <ProductHits
                        key={source.sourceId}
                        autocomplete={autocomplete}
                        items={items}
                        source={source}
                      />
                    )
                  }

                  return null;
                })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;