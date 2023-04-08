import { useRef, useEffect } from 'react'

/**
 * This hook is React 18 compatible, to prevent useEffect hook being call twice because of react concurrent rendering
 *
 * @param onDidMountCallback The function you'd like to trigger when component first mounted
 *
 */
const useComponentDidMountHook = (onDidMountCallback: Function) => {
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;

    onDidMountCallback();

    executedRef.current = true;
  });
};

export default useComponentDidMountHook;
