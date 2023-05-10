import type { ApiErrorResponse } from '~/shared/types';

export enum EmailSubscribeActionTypes {
  set_open_subscribe_modal = 'open_subscribe_modal',
};

type StateShape = {
  open: boolean;
  error: ApiErrorResponse | null;
}

interface OpenSubscribeModalPayload {
  open: boolean;
  error: null | ApiErrorResponse;
}

// ------- actions -------

interface EmailSubscribeAction {
  type: EmailSubscribeActionTypes;
  payload: OpenSubscribeModalPayload | string;
}

// ------- action creators -------
export const setOpenEmailSubscribeModal = (open: boolean, error: null | ApiErrorResponse): EmailSubscribeAction => {
  return {
    type: EmailSubscribeActionTypes.set_open_subscribe_modal,
    payload: {
      open,
      error
    }
  };
};

export default function EmailSubscribeReducer(state: StateShape, action: EmailSubscribeAction): StateShape {
  switch (action.type) {
    case EmailSubscribeActionTypes.set_open_subscribe_modal: {
      const payload = action.payload as OpenSubscribeModalPayload;
      return {
        ...state,
        open: payload.open,
        error: payload.error,
      };
    }
    default:
      return state
  }
}