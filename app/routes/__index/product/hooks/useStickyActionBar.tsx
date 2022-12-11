import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

// Scroll to top when this page is rendered since `ScrollRestoration` would keep the scroll position at the bottom.
function useStickyActionBar(
  stickyRef: MutableRefObject<HTMLDivElement | null>,
  sickySectionRef: MutableRefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const handleWindowScrolling = () => {
      if (!window || !stickyRef.current || !sickySectionRef.current) return;
      const windowDOM = window as Window;
      const stickySectionRefDOM = sickySectionRef.current.getBoundingClientRect();
      const isScrollAtDivBottom = windowDOM.innerHeight + windowDOM.scrollY >= stickySectionRefDOM.bottom + windowDOM.scrollY;
      if (isScrollAtDivBottom) {
        if (stickyRef.current.style.position === 'relative') return;
        stickyRef.current.style.position = 'relative';
      } else {
        if (stickyRef.current.style.position === 'fixed') return;
        stickyRef.current.style.position = 'fixed';
      }
    }

    if (window) {
      window.scrollTo(0, 0);

      // Listen to scroll position of window, if window scroll bottom is at bottom position of productContentWrapperRef
      // change position of `productContentWrapperRef` from `fixed` to `relative`.
      window.addEventListener('scroll', handleWindowScrolling);
    }

    return () => window.removeEventListener('scroll', handleWindowScrolling);
  }, []);
}

export default useStickyActionBar;