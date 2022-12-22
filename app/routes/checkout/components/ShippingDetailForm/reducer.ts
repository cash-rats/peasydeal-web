import type { Option } from './api.server';

export type AddressOptions = {
  label: string;
  value: Option;
}

type StateShape = {
  options: AddressOptions[];
  selectedOption: AddressOptions | null;
};

export const inistialState: StateShape = {
  options: [],
  selectedOption: null,
};

export enum AddressOptionsActionTypes {
  update_all_options = 'update_all_options',
  select_option = 'select_option',
}

type PayloadType = Option[] | Option;

interface AddressOptionsAction {
  type: AddressOptionsActionTypes;
  payload: PayloadType;
}

export const addressOptionsReducer = (state: StateShape, action: AddressOptionsAction): StateShape => {
  switch (action.type) {
    case 'update_all_options': {
      const payload = action.payload as Option[];
      return {
        ...state,
        options: payload.map((option) => ({
          label: `${option.line1}, ${option.line2}, ${option.city}`,
          value: option,
        })),
      };
    }
    case 'select_option': {
      const payload = action.payload as Option;

      return {
        ...state,
        selectedOption: {
          label: `${payload.line1}, ${payload.line2}, ${payload.city}`,
          value: payload,
        },
      };
    }
    default: {
      return state
    }
  }
}