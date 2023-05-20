import type { AutocompleteOptions } from '@algolia/autocomplete-shared';
import { MdClear as ClearIcon } from 'react-icons/md';
import { BiSearch as SearchIcon } from 'react-icons/bi';
import { Form } from '@remix-run/react';

import type { AlgoliaIndexItem } from '~/components/Algolia/types';
import {
  ProductHits,
  CategoryHits,
  RecentSearchHits,
} from '~/components/Algolia';

import { useCreateAutocomplete } from './hooks';

function Autocomplete(props: Partial<AutocompleteOptions<AlgoliaIndexItem>>) {
  const {
    autocomplete,
    state,
    formRef,
    inputRef,
    panelRef,
  } = useCreateAutocomplete(props)

  return (
    <div
      className="aa-Autocompletel relative"
      {...autocomplete.getRootProps({})}
    >
      <Form
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
        ref={formRef}
        className="aa-Form"
        method="post"
        action="/search?index"
      >
        <input
          type="hidden"
          name="query"
          value={state.autoCompleteState.query}
        />
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
      </Form>

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
                    return (
                      <ProductHits
                        key={source.sourceId}
                        autocomplete={autocomplete}
                        items={items}
                        source={source}
                      />
                    )
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

                  if (source.sourceId === 'categoriesPlugin') {
                    return (
                      <CategoryHits
                        key={source.sourceId}
                        state={state.autoCompleteState}
                        source={source}
                        items={items}
                        autocomplete={autocomplete}
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