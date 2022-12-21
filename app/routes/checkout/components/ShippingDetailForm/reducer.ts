import type { Option, AddressPartialOptions } from './api.server';

export const inistialState = {
  line1s: [],
  line2s: [],
  cities: [],
  counties: [],
  countries: [],
}

export enum AddressOptionsActionTypes {
  update_all_options = 'update_all_options',
}

interface AddressOptionsAction {
  type: AddressOptionsActionTypes;
  payload: AddressPartialOptions;
}

interface AddressOptionsState {
  line1s: Option[];
  line2s: Option[];
  cities: Option[];
  counties: Option[];
  countries: Option[];
}

export const addressOptionsReducer = (state: AddressOptionsState, action: AddressOptionsAction) => {
  switch (action.type) {
    case 'update_all_options': {
      return {
        ...state,
        line1s: action.payload.line1s,
        line2s: action.payload.line2s,
        cities: action.payload.cities,
        counties: action.payload.counties,
        countries: action.payload.countries,
      }
    }
    default: {
      return state
    }
  }
}