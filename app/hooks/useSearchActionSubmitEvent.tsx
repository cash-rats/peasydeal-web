import { useEffect } from 'react';
import type { RefObject } from 'react';

import { trackEvent } from '~/lib/gtm';

type UseSearchActionSubmitEventParams = {
  formRef: RefObject<HTMLFormElement>;
  query: string;
};

export function useSearchActionSubmitEvent({
  formRef,
  query,
}: UseSearchActionSubmitEventParams) {
  useEffect(() => {
    const submitListener = () => {
      trackEvent('pd_search_action_click', {
        query,
      });
    };

    formRef.current?.addEventListener('submit', submitListener);

    return () => {
      formRef.current?.removeEventListener('submit', submitListener);
    };
  }, [formRef, query]);
}
