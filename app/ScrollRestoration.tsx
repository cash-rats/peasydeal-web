import * as React from "react";
import { useLocation } from "react-router-dom";

import { useBeforeUnload, useTransition } from "@remix-run/react";

let STORAGE_KEY = "positions";

let positions: { [key: string]: number } = {};

if (typeof document !== "undefined") {
  let sessionPositions = sessionStorage.getItem(STORAGE_KEY);
  if (sessionPositions) {
    positions = JSON.parse(sessionPositions);
  }
}

/**
 * This component will emulate the browser's scroll restoration on location
 * changes.
 *
 * @see https://remix.run/api/remix#scrollrestoration
 */
export function ScrollRestoration({ nonce = undefined }: { nonce?: string }) {
  // console.log('debug * 1 ScrollRestoration');
  useScrollRestoration();

  // wait for the browser to restore it on its own
  React.useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  // let the browser restore on it's own for refresh
  useBeforeUnload(
    React.useCallback(() => {
      window.history.scrollRestoration = "auto";
    }, [])
  );

  let restoreScroll = ((STORAGE_KEY: string) => {
    console.log('debug * 1 - 1', window.history.state.key);
    if (!window.history.state || !window.history.state.key) {
      console.log('debug * 1 - 2');
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({ key }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
      let storedY = positions[window.history.state.key];
      console.log('debug * 1 - 3', storedY);
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }).toString();

  return (
    <script
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${restoreScroll})(${JSON.stringify(STORAGE_KEY)})`,
      }}
    />
  );
}

let hydrated = false;

function useScrollRestoration() {
  let location = useLocation();
  let transition = useTransition();

  let wasSubmissionRef = React.useRef(false);

  React.useEffect(() => {
    if (transition.submission) {
      wasSubmissionRef.current = true;
    }
  }, [transition]);

  React.useEffect(() => {

    console.log('debug * 3', location.key);
    console.log('debug * 4', location.pathname);
    console.log('debug * 5', positions);
    console.log('debug * 6', window.scrollY);
    if (transition.location) {
      console.log('debug * 6 - 1');

      // positions[location.key] = window.scrollY;
      positions[location.key] = window.scrollY;

      console.log('debug * 6 - 2', positions[location.key]);
    }
  }, [transition, location]);

  useBeforeUnload(
    React.useCallback(() => {
      console.log('debug * 7', positions);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    }, [])
  );

  if (typeof document !== "undefined") {
    // eslint-disable-next-line
    React.useLayoutEffect(() => {
      // don't do anything on hydration, the component already did this with an
      // inline script.
      if (!hydrated) {
        hydrated = true;
        return;
      }

      console.log('debug * 8', location);
      console.log('debug * 9', positions[location.key]);
      let y = positions[location.key];

      // been here before, scroll to it
      if (y != undefined) {

        console.log('debug * 10', y);
        window.scrollTo(0, y);

        console.log('debug * 11', y);
        return;
      }

      // try to scroll to the hash
      if (location.hash) {
        let el = document.getElementById(location.hash.slice(1));
        if (el) {
          el.scrollIntoView();
          return;
        }
      }

      // don't do anything on submissions
      if (wasSubmissionRef.current === true) {
        wasSubmissionRef.current = false;
        return;
      }

      // otherwise go to the top on new locations
      window.scrollTo(0, 0);
    }, [location]);
  }

  React.useEffect(() => {
    if (transition.submission) {
      wasSubmissionRef.current = true;
    }
  }, [transition]);
}