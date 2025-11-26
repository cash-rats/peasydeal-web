import type { AddressOption as Option } from '../../api.server';

export type AddressOptions = {
  label: string;
  value: Option;
}

type StateShape = {
  options: AddressOptions[];
  selectedOption: AddressOptions | null;
  postal: string;
};

export const inistialState: StateShape = {
  options: [],
  selectedOption: null,
  postal: '',
};

export enum AddressOptionsActionTypes {
  update_all_options = 'update_all_options',
  select_option = 'select_option',
  on_change_postal = 'on_change_postal',
}

interface AddressOptionsAction {
  type: AddressOptionsActionTypes;
  payload: Option[] |
  Option |
  string;
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
    case 'on_change_postal': {
      const payload = action.payload as string;
      return {
        ...state,
        postal: payload,
      };
    }
    default: {
      return state
    }
  }
}
