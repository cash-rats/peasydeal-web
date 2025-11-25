// useEmailSubscribe.ts
import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
import type { ApiErrorResponse } from '~/shared/types';

export default function useEmailSubscribe() {
  const [email, setEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === 'done') {
      const data = fetcher.data;

      if (data?.error) {
        setError(data);
        return;
      }

      setError(null);
      setOpenModal(true);
    }
  }, [fetcher]);

  const onCloseModal = () => {
    setOpenModal(false);
    setError(null);
  };

  return {
    email,
    setEmail,
    fetcher,
    openModal,
    error,
    onCloseModal,
  };
}
