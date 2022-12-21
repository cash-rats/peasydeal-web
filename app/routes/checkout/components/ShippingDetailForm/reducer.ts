import type { Option, AddressPartialOptions } from './api.server';

type AddressParts = 'line1s' | 'line2s' | 'cities' | 'counties' | 'countries';

type StateShape = {
  [key in AddressParts]: {
    options: Option[];
    defaultOption: Option | null;
  };
};

export const inistialState: StateShape = {
  line1s: {
    options: [],
    defaultOption: null,
  },
  line2s: {
    options: [],
    defaultOption: null,
  },
  cities: {
    options: [],
    defaultOption: null,
  },
  counties: {
    options: [],
    defaultOption: null,
  },
  countries: {
    options: [],
    defaultOption: null,
  },
}

export enum AddressOptionsActionTypes {
  update_all_options = 'update_all_options',
}

interface AddressOptionsAction {
  type: AddressOptionsActionTypes;
  payload: AddressPartialOptions;
}

export const addressOptionsReducer = (state: StateShape, action: AddressOptionsAction): StateShape => {
  switch (action.type) {
    case 'update_all_options': {
      return {
        ...state,
        line1s: {
          options: action.payload.line1s,
          defaultOption: action.payload.line1s[0] || null
        },
        line2s: {
          options: action.payload.line1s,
          defaultOption: action.payload.line2s[0] || null
        },
        cities: {
          options: action.payload.line1s,
          defaultOption: action.payload.cities[0] || null
        },
        counties: {
          options: action.payload.line1s,
          defaultOption: action.payload.counties[0] || null
        },
        countries: {
          options: action.payload.line1s,
          defaultOption: action.payload.countries[0] || null
        },
      }
    }
    default: {
      return state
    }
  }
}