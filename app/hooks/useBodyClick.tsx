import type { MouseEvent } from 'react';
import { useEffect } from 'react';

const useBodyClick = (cb: (evt: MouseEvent<HTMLBodyElement>) => void) => {
  useEffect(() => {
    if (!document) return;

    document.addEventListener('click', cb);
    return () => window.removeEventListener('click', cb);
  });
}

export default useBodyClick;