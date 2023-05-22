import type { AutocompleteState } from '@algolia/autocomplete-core'

import type { AutocompleteItem } from '~/components/Algolia/types';

export enum MobileSearchTypes {
  set_agolia_state = 'set_agolia_state',
};

type StateShape = {
  autoCompleteState: AutocompleteState<AutocompleteItem>
};

interface MobileSearchAction {
  type: MobileSearchTypes,
  payload: AutocompleteState<AutocompleteItem>
}

export const setAutoCompleteState = (state: AutocompleteState<AutocompleteItem>) => {
  return {
    type: MobileSearchTypes.set_agolia_state,
    payload: state,
  };
};

export default function MobileSearchDialogReducer(state: StateShape, action: MobileSearchAction) {
  switch (action.type) {
    case MobileSearchTypes.set_agolia_state: {
      const autoCompleteState = action.payload as AutocompleteState<AutocompleteItem>;

      return {
        ...state,
        autoCompleteState,
      };
    }
    default:
      return state;
  }
};