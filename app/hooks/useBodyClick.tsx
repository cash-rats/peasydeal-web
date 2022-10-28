import { useEffect } from 'react';

const useBodyClick = (cb: (evt: MouseEvent) => void) => {
  useEffect(() => {
    if (!document) return;

    document.addEventListener('click', cb);
    return () => window.removeEventListener('click', cb);
  });
}

export default useBodyClick;