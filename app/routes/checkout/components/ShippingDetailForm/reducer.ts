import type { AddressOption as Option } from '~/routes/api.fetch-address-options-by-postal/types';

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

const buildAddressLabel = (option: Option) => (
  [
    option.line1,
    option.line2,
    option.city,
    option.county,
    option.postal,
  ].filter(Boolean).join(', ')
);

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
          label: buildAddressLabel(option),
          value: option,
        })),
      };
    }
    case 'select_option': {
      const payload = action.payload as Option;

      return {
        ...state,
        selectedOption: {
          label: buildAddressLabel(payload),
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
