import type { LinksFunction } from '@remix-run/node';
import { useMemo, useEffect } from 'react';
import { useTransition, useFetchers } from '@remix-run/react';
import NProgress from 'nprogress';
import nprogressStyles from 'nprogress/nprogress.css';

import styles from './styles/nprogress.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: nprogressStyles },
    { rel: 'stylesheet', href: styles },
  ];
};

const ConfNProgress = NProgress.configure({ showSpinner: false });

const useNprogress = () => {

  let transition = useTransition();
  let fetchers = useFetchers();
  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  let state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      let states = [
        transition.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [transition.state, fetchers]
  );


  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === "loading") ConfNProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === "idle") ConfNProgress.done();
  }, [transition.state]);
};

export default useNprogress;