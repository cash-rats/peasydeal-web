import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

const useStickyDivs = <T extends MutableRefObject<HTMLElement | null>>(ref: T, startStickyAt: number) => {
  useEffect(() => {
    const handleWindowScrolling = (evt: Event) => {
      const windowDOM = window as Window;
      if (!ref.current) return;

      if (windowDOM.scrollY >= startStickyAt) {
        if (ref.current.style.position === 'fixed') return;
        ref.current.style.position = 'fixed';
      } else {
        if (ref.current.style.position === 'relative') return;
        ref.current.style.position = 'relative';
      }
    }

    if (window) {
      // Listen to scroll position of window. If window scrolls to certain position, we
      // change the css position attribute of `Index__left-ads-wrapper`
      window.addEventListener('scroll', handleWindowScrolling);
    }

    return () => window.removeEventListener('scroll', handleWindowScrolling);
  }, [ref, startStickyAt]);
}

export default useStickyDivs;