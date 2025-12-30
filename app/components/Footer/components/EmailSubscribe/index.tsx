import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useFetcher } from 'react-router';

import SubscribeModal from '~/components/EmailSubscribeModal';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import type { ApiErrorResponse } from '~/shared/types';

function EmailSubscribe() {
  const fetcher = useFetcher();
  const [email, setEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

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

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  return (
    <>
      <SubscribeModal open={openModal} onClose={onCloseModal} error={error} />

      <div className="flex flex-col text-center">
        <span className="
        font-bold text-3xl
          capitalize
        ">
          get free £3 GBP
        </span>

        <p className="mt-4 text-base">
          Join to our news letter & get £3 GBP voucher
        </p>

        <div className="w-full">
          <fetcher.Form
            action='/api/email-subscribe'
            method='post'
            className="mt-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center"
          >
            <Input
              name="email"
              type="email"
              placeholder='Enter Your Email Address'
              className={cn(
                'w-full rounded-lg border bg-white text-foreground',
                error && 'border-destructive focus-visible:ring-destructive'
              )}
              value={email}
              onChange={handleChangeEmail}
              autoComplete="email"
              aria-invalid={!!error}
              required
            />

            <Button
              type='submit'
              className='rounded-lg bg-[#d02e7d] text-base font-semibold text-white hover:bg-[#b6266a]'
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle' ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </fetcher.Form>

          {error && (
            <div className="w-full text-left text-red-500 text-sm mt-1 font-poppins">
              {error.error}
            </div>
          )}
        </div>

        <p className="mt-3 text-sm md:text-base">
          * Can be use on order £30+, Terms and Condition applied
        </p>
      </div>
    </>
  )
}

export default EmailSubscribe;
