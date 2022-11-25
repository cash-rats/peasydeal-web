import type { LinksFunction } from '@remix-run/node';
import { useEffect } from 'react';
import { useTransition } from '@remix-run/react';
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

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (transition.state !== "idle") {
      ConfNProgress.start();
    } else {
      ConfNProgress.done();
    }
    // when the state is idle then we can to complete the progress bar
  }, [transition.state]);
};

export default useNprogress;