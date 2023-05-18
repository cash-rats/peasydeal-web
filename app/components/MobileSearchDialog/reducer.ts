import type { AutocompleteState } from '@algolia/autocomplete-js'

import type { AlgoliaIndexItem } from '~/components/algolia/types';

export enum MobileSearchTypes {
  set_agolia_state = 'set_agolia_state',
};

type StateShape = {
  autoCompleteState: AutocompleteState<AlgoliaIndexItem>
};

interface MobileSearchAction {
  type: MobileSearchTypes,
  payload: AutocompleteState<AlgoliaIndexItem>
}

export const setAutoCompleteState = (state: AutocompleteState<AlgoliaIndexItem>) => {
  return {
    type: MobileSearchTypes.set_agolia_state,
    payload: state,
  };
};


export default function MobileSearchDialogReducer(state: StateShape, action: MobileSearchAction) {
  switch (action.type) {
    case MobileSearchTypes.set_agolia_state: {
      const autoCompleteState = action.payload as AutocompleteState<AlgoliaIndexItem>;

      return {
        ...state,
        autoCompleteState,
      };
    }
    default:
      return state;
  }
};