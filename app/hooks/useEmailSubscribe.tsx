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
    if (fetcher.state !== 'idle') return;
    if (fetcher.data === undefined) return;

    const result = fetcher.data as
      | { ok: true }
      | ({ ok: false } & ApiErrorResponse)
      | ApiErrorResponse
      | undefined;

    if (!result) return;

    if ('ok' in result) {
      if (!result.ok) {
        setError(result);
        return;
      }

      setError(null);
      setOpenModal(true);
      return;
    }

    if (result?.error) {
      setError(result);
      return;
    }

    setError(null);
    setOpenModal(true);
  }, [fetcher.data, fetcher.state]);

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
