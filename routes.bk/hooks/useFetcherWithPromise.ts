import { useRef, useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router';
import type { SubmitOptions } from 'react-router';

export interface SubmitFunctionWithPromise {
  (
    /**
     * Specifies the `<form>` to be submitted to the server, a specific
     * `<button>` or `<input type="submit">` to use to submit the form, or some
     * arbitrary data to submit.
     *
     * Note: When using a `<button>` its `name` and `value` will also be
     * included in the form data that is submitted.
     */
    target: HTMLFormElement | HTMLButtonElement | HTMLInputElement | FormData | URLSearchParams | {
      [name: string]: string;
    } | null,
    /**
     * Options that override the `<form>`'s own attributes. Required when
     * submitting arbitrary data without a backing `<form>`.
     */
    options?: SubmitOptions
  ): any;
}

export default function useFetcherWithPromise() {
  let resolveRef = useRef<any>();
  let promiseRef = useRef<Promise<any>>();
  let fetcher = useFetcher();

  if (!promiseRef.current) {
    promiseRef.current = new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }

  const resetResolver = useCallback(() => {
    promiseRef.current = new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, [promiseRef, resolveRef]);

  const submit: SubmitFunctionWithPromise = useCallback(
    async (...args): Promise<any | undefined> => {
      fetcher.submit(...args);
      return promiseRef.current;
    },
    [fetcher, promiseRef],
  );

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      resolveRef.current(fetcher.data);
      resetResolver();
    }
  }, [fetcher, resetResolver]);

  return { fetcher, submit };
}