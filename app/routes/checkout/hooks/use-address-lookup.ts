import { useEffect, useReducer, useRef } from 'react';
import { useFetcher } from 'react-router';

import type { AddressOption } from '~/routes/api.fetch-address-options-by-postal/types';
import {
  addressOptionsReducer,
  AddressOptionsActionTypes,
  inistialState,
} from '../components/ShippingDetailForm/reducer';


export function useAddressLookup() {
  const fetcher = useFetcher<AddressOption[]>();
  const [state, dispatch] = useReducer(addressOptionsReducer, inistialState);
  const lastLookupPostalRef = useRef<string>('');

  const normalizePostal = (postal?: string) => (
    (postal ?? '').trim().replace(/\s+/g, ' ')
  );

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

    lastLookupPostalRef.current = normalizePostal(nextPostal);
    fetcher.submit(
      { postal: nextPostal },
      {
        method: 'post',
        action: '/api/fetch-address-options-by-postal',
      },
    );
  };

  const hasNoResults = (
    fetcher.state === 'idle' &&
    Array.isArray(fetcher.data) &&
    fetcher.data.length === 0 &&
    lastLookupPostalRef.current === normalizePostal(state.postal)
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
