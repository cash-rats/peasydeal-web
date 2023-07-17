import type { ApiErrorResponse } from '~/shared/types';

export enum promoteSubscriptionModalActionTypes {
  set_open_subscribe_modal = 'open_subscribe_modal',
  set_submit_subscription = 'set_submit_subscription',
};

type StateShape = {
  open: boolean;
  error?: ApiErrorResponse | null;
}

interface OpenSubscribeModalPayload {
  open: boolean;
  error?: null | ApiErrorResponse;
}

// ------- actions -------

interface PromoteSubscriptionModalAction {
  type: promoteSubscriptionModalActionTypes;
  payload: OpenSubscribeModalPayload | string;
}

// ------- action creators -------
export const setOpenPromoteSubscriptionModal = (open: boolean): PromoteSubscriptionModalAction => {
  return {
    type: promoteSubscriptionModalActionTypes.set_open_subscribe_modal,
    payload: {
      open,
    }
  };
};

export const setSubmitSubscription = (open: boolean, error: null | ApiErrorResponse): PromoteSubscriptionModalAction => {
  return {
    type: promoteSubscriptionModalActionTypes.set_open_subscribe_modal,
    payload: {
      open,
      error
    }
  };
};

export default function PromoteSubscriptionModalReducer(state: StateShape, action: PromoteSubscriptionModalAction): StateShape {
  switch (action.type) {
    case promoteSubscriptionModalActionTypes.set_submit_subscription: {
      const payload = action.payload as OpenSubscribeModalPayload;
      return {
        ...state,
        error: payload.error,
      };
    }

    case promoteSubscriptionModalActionTypes.set_open_subscribe_modal: {
      const payload = action.payload as OpenSubscribeModalPayload;
      return {
        ...state,
        open: payload.open,
      };
    }
    default: return state;
  }
}