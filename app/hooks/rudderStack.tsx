import { useEffect } from 'react';
import type { RefObject } from 'react';

type IUseSearchActionClick = {
  formRef: RefObject<HTMLFormElement>;
  query: string;
};

export const useSearchActionSubmitEvent = ({ formRef, query }: IUseSearchActionClick) => {
  useEffect(() => {
    const submitListener = () => {
      window.rudderanalytics?.track('search_action_click', {
        query,
      });
    }

    formRef.current?.addEventListener('submit', submitListener);

    return () => {
      formRef.current?.removeEventListener('submit', submitListener);
    }

  }, [formRef, query]);
};