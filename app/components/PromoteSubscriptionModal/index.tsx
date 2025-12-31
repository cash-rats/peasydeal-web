import { useEffect, useReducer, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FiX } from 'react-icons/fi';
import { useFetcher } from 'react-router';

import SubscribeResultCard from '~/components/EmailSubscribeModal/SubscribeResultCard';
import reducer, { setOpenPromoteSubscriptionModal } from '~/components/PromoteSubscriptionModal/reducer';

import voucherImage from './images/3off@2x.png';
import { Dialog, DialogClose, DialogContent } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import type { ApiErrorResponse } from '~/shared/types';

interface PromoteSubscriptionModalProps {
  /**
   * When `forceDisable` is set to true, this modal would not
   * open whatsoever regardless of configs set in localstorage.
   *
   * Usecase: When request is from google bot agent like `StoreBot`,
   * we don't want to display this modal.
   */
  forceDisable?: boolean;
};

function PromoteSubscriptionModal({ forceDisable = false }: PromoteSubscriptionModalProps) {
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    error: null,
  });

  const subFetcher = useFetcher();
  const [email, setEmail] = useState('');
  const [subscribeError, setSubscribeError] = useState<ApiErrorResponse | null>(null);

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const onCloseModal = () => {
    // Set local storage for expiration
    const expiration = Date.now() + 1 * 60 * 60 * 1000; // 1 hours in milliseconds
    localStorage.setItem('modalClosed', 'true');
    localStorage.setItem('modalClosedExpiration', expiration.toString());

    // Close Modal
    dispatch(setOpenPromoteSubscriptionModal(false));
    setSubscribeError(null);
  };

  useEffect(() => {
		if (forceDisable) return;

    // localStorage check
    const modalClosed = localStorage.getItem('modalClosed') === 'true';
    const expiration = localStorage.getItem('modalClosedExpiration');

    const openModal = () => {
      setTimeout(() => {
        dispatch(setOpenPromoteSubscriptionModal(true));
      }, 2000);
    }

    if (!modalClosed && !expiration) {
      openModal();
    }

    if (modalClosed && expiration && Date.now() > parseInt(expiration)) {
      openModal();
    }
  }, [forceDisable]);

  useEffect(() => {
    if (subFetcher.state === 'idle' && subFetcher.data !== undefined) {
      dispatch(setOpenPromoteSubscriptionModal(true));
    }
  }, [subFetcher.data, subFetcher.state]);

  useEffect(() => {
    if (subFetcher.state !== 'idle') return;
    if (subFetcher.data === undefined) return;

    const result = subFetcher.data as
      | { ok: true }
      | ({ ok: false } & ApiErrorResponse)
      | ApiErrorResponse
      | undefined;

    if (!result) return;

    if ('ok' in result) {
      setSubscribeError(result.ok ? null : result);
      return;
    }

    if (result?.error) {
      setSubscribeError(result);
      return;
    }

    setSubscribeError(null);
  }, [subFetcher.data, subFetcher.state]);

  const showSubscribeResult = subFetcher.state === 'idle' && subFetcher.data !== undefined;

  const dialogContentClassName = showSubscribeResult
    ? 'w-full max-w-md bg-transparent p-0 shadow-none border-0'
    : 'max-w-[90vw] md:max-w-[486px] lg:max-w-lg xl:max-w-screen-xl rounded-2xl overflow-hidden p-0 border-0 bg-transparent shadow-none';

  return (
    <Dialog
      open={state.open}
      onOpenChange={open => {
        if (!open) onCloseModal();
      }}
    >
      <DialogContent className={dialogContentClassName}>
        {!showSubscribeResult ? (
          <DialogClose
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={onCloseModal}
          >
            <FiX className="h-4 w-4" aria-hidden />
            <span className="sr-only">Close</span>
          </DialogClose>
        ) : null}

        {
          showSubscribeResult ? (
            <SubscribeResultCard error={subscribeError} onClose={onCloseModal} />
          ) : (
            <div className="flex flex-col xl:flex-row bg-white rounded-2xl overflow-hidden">
              <div className="h-full bg-[#a02121] aspect-square min-w-[320px] xl:max-w-[500px]">
                <img className="h-full" src={voucherImage} alt="3GBP Off" />
              </div>
              <div className="flex-1 p-4 md:p-6 lg:p-10 lg:min-w-[300px]">
                <h3 className="
                  leading-relaxed text-xl md:text-2xl lg:text-3xl my-2 md:my-4 max-w-3xl
                  font-poppins font-bold
                ">
                  New subscription only!
                </h3>

                <h3 className="
                  leading-relaxed text-base md:text-xl lg:text-2xl my-2 md:my-4 max-w-3xl
                  font-poppins font-medium
                ">
                  Join to our newsletter & get £3 GBP voucher
                </h3>

                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email-input"
                  type="email"
                  className="flex-auto rounded-lg border-0 bg-white px-4 py-4 shadow-md ring-1 ring-slate-300/80 focus:ring-2 w-full focus:ring-slate-400/70 sm:text-base lg:text-lg sm:leading-6"
                  placeholder="Enter your email"
                  style={{ paddingRight: "46px" }}
                  value={email}
                  onChange={handleChangeEmail}
                />
                <subFetcher.Form action='/api/email-subscribe' method='post'>
                  <div className='flex flex-col sm:flex-row justify-center gap-y-2 sm:gap-y-0 gap-x-2 items-center'>
                    <input type='hidden' name='email' value={email} />
                    <Button
                      type='submit'
                      disabled={subFetcher.state !== 'idle'}
                      className="rounded-lg h-full py-4 whitespace-nowrap px-6 sm:px-12 text-base font-bold lg:text-lg text-white shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 w-full focus-visible:outline-offset-2 focus-visible:outline-white mt-4"
                      style={{ backgroundColor: "#d02e7d" }}
                    >
                      {subFetcher.state !== 'idle' ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </div>
                </subFetcher.Form>
                <p className="leading-relaxed text-base md:text-xl my-2 md:my-4 max-w-3xl xl:text-left text-center">
                  * Can be use on order £30+, Terms and Condition applied
                </p>
              </div>
            </div>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default PromoteSubscriptionModal;
