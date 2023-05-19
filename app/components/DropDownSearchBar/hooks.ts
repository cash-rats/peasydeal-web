import {
  useMemo,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import type { AutocompleteOptions } from '@algolia/autocomplete-core'
import { createAutocomplete } from '@algolia/autocomplete-core';
import type {
  BaseSyntheticEvent,
  MouseEvent,
  KeyboardEvent
} from 'react';

import type { AutocompleteItem } from '~/components/Algolia/types';

import reducer, { setAutoCompleteState } from './reducer';

/**
 * Initialize agolia `createAutocomplete` with keyboard event hooked up
 * to algolia event handler.
 */
export function useCreateAutocomplete(props: Partial<AutocompleteOptions<AutocompleteItem>>) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      autoCompleteState: {
        collections: [],
        completion: null,
        context: {},
        isOpen: false,
        query: '',
        activeItemId: null,
        status: 'idle',
      },
    },
  );

  const autocomplete = useMemo(() => {
    return createAutocomplete<
      AutocompleteItem,
      BaseSyntheticEvent,
      MouseEvent,
      KeyboardEvent
    >({
      insights: true,
      // insights: true,
      onStateChange({ state }) {
        // console.log('debug 1', state);
        dispatch(setAutoCompleteState(state));
      },
      ...props,
    });
  }, [props]);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { getEnvironmentProps } = autocomplete;

  useEffect(() => {
    if (!formRef.current || !panelRef.current || !inputRef.current) {
      return undefined;
    }

    const { onTouchStart, onTouchMove, onMouseDown } = getEnvironmentProps({
      formElement: formRef.current,
      inputElement: inputRef.current,
      panelElement: panelRef.current,
    });

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };

  }, [
    getEnvironmentProps,
    state.autoCompleteState.isOpen,
  ])

  return {
    autocomplete,
    state,
    dispatch,
    inputRef,
    formRef,
    panelRef,
  };
};

export const useAttachAutocompleteKeyboardEvents = (autocomplete) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { getEnvironmentProps } = autocomplete;

  useEffect(() => {
    if (!formRef.current || !panelRef.current || !inputRef.current) {
      return undefined;
    }

    const { onTouchStart, onTouchMove, onMouseDown } = getEnvironmentProps({
      formElement: formRef.current,
      inputElement: inputRef.current,
      panelElement: panelRef.current,
    });

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };

  }, [
    getEnvironmentProps,
    // state.autoCompleteState.isOpen,
  ])

  return { inputRef, formRef, panelRef }
}