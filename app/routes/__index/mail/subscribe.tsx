import type { V2_MetaFunction } from '@remix-run/node';
import { useState, useEffect, useReducer } from "react";
import type { ChangeEvent } from 'react';
import { useFetcher } from 'react-router'
import type { TContentfulPost } from '~/shared/types';
import { getRootFBSEO_V2 } from '~/utils/seo';

import { Button } from '@chakra-ui/react'

import SubscribeModal from '~/components/EmailSubscribeModal';
import type { ApiErrorResponse } from '~/shared/types';
import reducer, { setOpenEmailSubscribeModal } from '~/components/EmailSubscribeModal/reducer';

import subscribeBG from '~/images/mailing-bg.png';

export const meta: V2_MetaFunction = ({ data }: { data: TContentfulPost }) => {
  return getRootFBSEO_V2()
    .map(tag => {
      if (!('property' in tag)) return tag

      if (tag.property === 'og:title') {
        tag.content = 'Join our mailing list and get £3 GBP for FREE | PeasyDeals';
      }

      if (tag.property === 'og:description') {
        tag.content = 'Join our mailing list to get the latest trendy idea and exclusive promotions';
      }

      return tag;
    })
}

export default function Subscribe() {
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    error: null,
  });

  const [email, setEmail] = useState('');

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const onCloseModal = () =>
    dispatch(setOpenEmailSubscribeModal(false, null));
  const subFetcher = useFetcher();
  useEffect(() => {
    if (subFetcher.type === 'done') {
      const data = subFetcher.data;

      if (data.err_code) {
        const errResp = data as ApiErrorResponse
        dispatch(setOpenEmailSubscribeModal(true, errResp))
        return;
      }

      // Open modal
      // display subscription email sent.
      window.rudderanalytics?.track('email_subscribed');
      dispatch(setOpenEmailSubscribeModal(true, null))
    }
  }, [subFetcher.type]);

  return (
    <div>
      <div className='bg-[#f9e8ee] w-full'>
        <SubscribeModal
          open={state.open}
          onClose={onCloseModal}
          error={state.error}
        />
        <img src={subscribeBG} alt='subscribe-background' className='w-full max-w-[480px] p-4 mx-auto' />
        <div className="w-full py-8 px-4 max-w-screen-md mx-auto translate-y-[-25%]">
          <div className="peasydeal-v1 py-8 bg-white rounded-2xl w-full p-8 shadow-lg">
            <section className="relative text-center">
              <h2 className="mb-4 px-5 text-center font-custom text-3xl font-bold max-w-4xl md:leading-tight mx-auto">
                Subscribe Now
              </h2>
              <p className="leading-relaxed m-4 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
                Join our mailing list to get the latest trendy idea and exclusive promotions
              </p>

              <div
                className="flex flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center"
              >
                <label htmlFor="email-address" className="sr-only">
                  {/* <input type="hidden" name="iframe_id" value="gift-surprise-campaign" /> */}
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email-input"
                  type="email"
                  className="flex-auto rounded-lg border-0 bg-white px-4 py-4 shadow-md ring-1 ring-slate-300/80 focus:ring-2 w-full max-w-xl focus:ring-slate-400/70 sm:text-base lg:text-lg sm:leading-6"
                  placeholder="Enter your email"
                  style={{ paddingRight: "46px" }}
                  value={email}
                  onChange={handleChangeEmail}
                />
                <subFetcher.Form action='/subscribe?index' method='post' className='w-full md:w-fit'>
                  <div className='flex flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center w-full'>
                    <input type='hidden' name='email' value={email} />
                    <Button
                      isLoading={subFetcher.state !== 'idle'}
                      type='submit'
                      className="
                        rounded-lg h-full py-4 px-6 sm:px-12
                        whitespace-nowrap text-base font-bold lg:text-lg text-white shadow-lg
                        hover:opacity-90 transition focus-visible:outline focus-visible:outline-2
                        w-full focus-visible:outline-offset-2 focus-visible:outline-white"
                      style={{ backgroundColor: "#d02e7d" }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </subFetcher.Form>
              </div>

              <p className='block text-center px-2 pt-4 mx-auto'>By subscribing to our mailing list, you will get a <b>£3 GBP</b> voucher for FREE! This voucher be use on order £30+</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}