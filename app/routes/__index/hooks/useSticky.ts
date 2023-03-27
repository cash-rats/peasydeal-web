import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';

const useSticky = <T extends MutableRefObject<HTMLElement | null>>(ref: T, defaultTop: number = -1) => {
  const [top, setTop] = useState(defaultTop);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        if (top === -1) {
          const { top } = ref.current.getBoundingClientRect();
          setTop(top);
        }

        setSticky(window.scrollY >= top);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return { top, sticky };
}

export default useSticky;
