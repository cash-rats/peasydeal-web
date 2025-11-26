import { useEffect, useReducer } from 'react';
import { useFetcher } from 'react-router';

import type { AddressOption } from '../api.server';
import {
  addressOptionsReducer,
  AddressOptionsActionTypes,
  inistialState,
} from '../components/ShippingDetailForm/reducer';

const DEFAULT_ACTION = '/checkout/fetch-address-options-by-postal';

export function useAddressLookup(action: string = DEFAULT_ACTION) {
  const fetcher = useFetcher<AddressOption[]>();
  const [state, dispatch] = useReducer(addressOptionsReducer, inistialState);

  useEffect(() => {
    if (fetcher.state !== 'idle') return;
    if (!Array.isArray(fetcher.data)) return;

    dispatch({
      type: AddressOptionsActionTypes.update_all_options,
      payload: fetcher.data,
    });
  }, [fetcher.state, fetcher.data]);

  const setPostal = (postal: string) => {
    dispatch({
      type: AddressOptionsActionTypes.on_change_postal,
      payload: postal,
    });
  };

  const fetchOptions = (postal?: string) => {
    const nextPostal = postal ?? state.postal;
    if (!nextPostal) return;

    fetcher.submit(
      { postal: nextPostal },
      { method: 'post', action },
    );
  };

  const hasNoResults = (
    fetcher.state === 'idle' &&
    Array.isArray(fetcher.data) &&
    state.options.length === 0
  );

  return {
    options: state.options,
    postal: state.postal,
    setPostal,
    fetchOptions,
    isLoading: fetcher.state !== 'idle',
    hasNoResults,
  };
}

export default useAddressLookup;
