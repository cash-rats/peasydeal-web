import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const TrackWindowScrollTo = (
  target: RefObject<HTMLElement>,
  callback: () => void,
) => {
  const isInView = useRef(false);

  useEffect(() => {
    if (!target.current) return;

    const elem = target.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isInView.current) {
        isInView.current = true
        callback();
      }

      if (!entry.isIntersecting) isInView.current = false;
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    observer.observe(elem);

    return () => {
      observer.unobserve(elem);
    }
  }, [
    target,
    callback,
  ]);


}

export default TrackWindowScrollTo