import { useState, useEffect, useReducer } from "react";
import { useFetcher } from '@remix-run/react'
import type { ChangeEvent } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

import type { ApiErrorResponse } from '~/shared/types';
import successImage from '~/components/EmailSubscribeModal/images/email_subscription.png';
import reducer, { setOpenPromoteSubscriptionModal } from '~/components/PromoteSubscriptionModal/reducer';

import voucherImage from './images/3off@2x.png';

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

  const [email, setEmail] = useState('');
  const [err, setErr] = useState<any>(null);
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const onCloseModal = () => {
    // Set local storage for expiration
    const expiration = Date.now() + 1 * 60 * 60 * 1000; // 1 hours in milliseconds
    localStorage.setItem('modalClosed', 'true');
    localStorage.setItem('modalClosedExpiration', expiration.toString());

    // Close Modal
    dispatch(setOpenPromoteSubscriptionModal(false));
  }

  const subFetcher = useFetcher();

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
    if (subFetcher.type === 'done') {
      const data = subFetcher.data;

      if (data.err_code) {
        const errResp = data as ApiErrorResponse;
        setErr(errResp);
        dispatch(setOpenPromoteSubscriptionModal(true));
        return;
      }

      dispatch(setOpenPromoteSubscriptionModal(true));
    }
  }, [subFetcher.type]);

  return (
    <Modal
      isCentered
      closeOnOverlayClick
      isOpen={state.open}
      onClose={onCloseModal}
    >
      <ModalOverlay />
      <ModalContent className="
        max-w-[90vw] md:max-w-[486px] lg:max-w-lg xl:max-w-screen-xl rounded-2xl overflow-hidden
      ">
        <ModalCloseButton className="z-10" onClick={onCloseModal} />

        <ModalBody className="p-0">
          {
            subFetcher.type === 'done' ? (
              <div className="p-8 max-w-screen-sm mx-auto">
                <div className="font-poppins text-base text-center justify-center gap-2">
                  {
                    err !== null
                      ? 'Something went wrong! Please check the email your entered and try again.'
                      : (
                        <>
                          <img src={successImage} alt="email subscribe successfull" className='mx-auto mb-2' />
                          <p className="leading-relaxed text-base md:text-xl lg:text-2xl my-2 md:my-4 max-w-3xl font-poppins font-medium">An confirmation link and coupon has send to your email.</p>
                          <br />
                          <p className="leading-relaxed text-base md:text-xl lg:text-2xl my-2 md:my-4 max-w-3xl font-poppins font-medium">Please check your email for <b>£3 GBP voucher code</b> and click the <b>Confirm & Validate</b> button in the email to activate your voucher.</p>
                        </>)
                  }
                </div>
              </div>
            ) : (
              <div className="flex flex-col xl:flex-row">
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
                  {/* <p className="leading-relaxed text-base md:text-xl my-2 md:my-4 max-w-3xl">

                  </p> */}

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
                  <subFetcher.Form action='/subscribe?index' method='post'>
                    <div className='flex flex-col sm:flex-row justify-center gap-y-2 sm:gap-y-0 gap-x-2 items-center'>
                      <input type='hidden' name='email' value={email} />
                      <Button
                        isLoading={subFetcher.state !== 'idle'}
                        type='submit'
                        className="rounded-lg h-full py-4 whitespace-nowrap px-6 sm:px-12 text-base font-bold lg:text-lg text-white shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 w-full focus-visible:outline-offset-2 focus-visible:outline-white mt-4"
                        style={{ backgroundColor: "#d02e7d" }}
                      >
                        Subscribe
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

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PromoteSubscriptionModal;
