import type {
  BaseSyntheticEvent,
  MouseEvent,
  KeyboardEvent,
  RefObject,
} from 'react';
import type { AutocompleteState } from '@algolia/autocomplete-core';
import type { AutocompleteApi } from '@algolia/autocomplete-core'
import { MdClear as ClearIcon } from 'react-icons/md';
import { BiSearch as SearchIcon } from 'react-icons/bi';

import { useSearchActionSubmitEvent } from '~/hooks/useSearchActionSubmitEvent';
import type { AutocompleteItem } from '~/components/Algolia/types';

/*
 * @TODOs:
 *  - [x] query suggets
 *  - [x] categories results
 *  - [x] categories title
 *  - [x] collection order, category suggests should go after query suggests.
 *  - [x] Add recent search items
 *  - [x] Redirect recent search to search page
 *  - [x] Press enter redirects user to search page with query criteria
 *  - [x] Press submit button to redirect to search page with query criteria
 *  - [x] move state to reducer, why?
 *  - [x] rudderStack analytics
 *  - [ ] poppular search
 *  - [ ] Extract `createAutocomplete` logic to a hook
 *  - [ ] use `useCreateAutocomplete`
 */

interface SearchBarProps {
  autocomplete: AutocompleteApi<AutocompleteItem, BaseSyntheticEvent, MouseEvent, KeyboardEvent>;
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  state: AutocompleteState<AutocompleteItem>;
};

export default function SearchBar({
  autocomplete,
  formRef,
  inputRef,
  state,
}: SearchBarProps) {

  useSearchActionSubmitEvent({
    formRef,
    query: state.query
  });

  return (
    <div>
      <form
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
        ref={formRef}
        className="aa-Form"
      >
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            <button
              className="aa-SubmitButton"
              type="submit"
              title="Submit"
            >
              <SearchIcon />
            </button>
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
            className="aa-Input"
            ref={inputRef}
            autoCapitalize="off"
          />
          <input
            type="hidden"
            name="query"
            value={state.query}
          />
        </div>
        <div className="aa-InputWrapperSuffix">
          <button className="aa-ClearButton" title="Clear" type="reset">
            <ClearIcon />
          </button>
        </div>
      </form>

    </div>
  );
}
