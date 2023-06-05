import type { V2_MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useState, useEffect } from "react";
import { useLoaderData } from '@remix-run/react';
import { useFetcher } from '@remix-run/react'
import { Button } from '@chakra-ui/react'

import type { TContentfulPost } from '~/shared/types';
import { getRootFBSEO_V2 } from '~/utils/seo';
import type { ApiErrorResponse } from '~/shared/types';

import unsubscribeBG from './images/Unsubscribe-bg.png';

export const meta: V2_MetaFunction = ({ data }: { data: TContentfulPost }) => {
  return getRootFBSEO_V2().
    map(tag => {
      if (!('property' in tag)) return tag

      if (tag.property === 'og:title') {
        tag.content = "We're sorry to see you go | PeasyDeals";
      }

      if (tag.property === 'og:description') {
        tag.content = '';
      }

      return tag;
    });
}

type LoaderDataType = {
  uuid: string,
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const uuid = url.searchParams.get('uuid') || '';

  return json<LoaderDataType>({
    uuid,
  })
}

export default function Subscribe() {
  const {
    uuid
  } = useLoaderData<LoaderDataType>() || {};

  const [unsubscribed, setUnsubscribed] = useState<boolean>(false);

  const subFetcher = useFetcher();
  useEffect(() => {
    if (subFetcher.type === 'done') {
      const data = subFetcher.data;

      if (data.err_code) {
        const errResp = data as ApiErrorResponse;
        console.log(errResp);
        setUnsubscribed(false);
        return;
      }

      // Open modal
      // display subscription email sent.
      window.rudderanalytics?.track('email_unsubscribed');
      setUnsubscribed(true);
    }
  }, [subFetcher.type]);

  return (
    <div>
      <div className='bg-[#f9e8ee] w-full'>
        <img src={unsubscribeBG} alt='subscribe-background' className='w-full max-w-[400px] p-4 mx-auto' />
        <div className="w-full py-8 px-4 max-w-screen-md mx-auto translate-y-[-25%]">
          <div className="peasydeal-v1 py-8 bg-white rounded-2xl w-full p-8 shadow-lg">
            <section className="relative text-center">
              {
                unsubscribed ? (<h2 className="mb-4 px-5 text-center font-custom text-3xl font-bold max-w-4xl md:leading-tight mx-auto">
                  You have unsubscribed successfully!
                </h2>) : (
                  <>
                    <h2 className="mb-4 px-5 text-center font-custom text-3xl font-bold max-w-4xl md:leading-tight mx-auto">
                      Are you sure you want to unsubscribe?
                    </h2>
                    <p className="leading-relaxed m-4 text-lg sm:text-2xl my-4 text-center mx-auto max-w-2xl">
                      We're sorry to see you go! If you no longer wish to receive emails from us, please use the form below to unsubscribe.
                    </p>

                    <p className="leading-relaxed m-4 text-lg sm:text-2xl my-4 text-center mx-auto max-w-2xl">
                      By unsubscribing, you will no longer receive promotional emails, updates, and special offers from us.
                    </p>

                    <div
                      className="flex flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center mt-4"
                    >
                      <subFetcher.Form action='/unsubscribe?index' method='post' className='w-full md:w-fit'>
                        <div className='flex flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center w-full'>
                          <input type='hidden' name='uuid' value={uuid} />
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
                            Un-subscribe me
                          </Button>
                        </div>
                      </subFetcher.Form>
                    </div>
                  </>
                )
              }
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}