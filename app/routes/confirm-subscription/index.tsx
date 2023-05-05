/*
  - You have successfully confirmed
*/
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch, useLoaderData, Link } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import { Button } from '@chakra-ui/react';

import CouponBox from '~/components/CouponBox';

import { activateEmailSubscribe } from './api.server';


export const loader: LoaderFunction = async ({ request }) => {
  // Retrieve "uuid" query params
  const url = new URL(request.url);
  const hash = url.searchParams.get('uuid');

  // Display error page
  if (!hash) {
    throw json({ message: 'invalid subscription' }, { status: httpStatus.NOT_FOUND })
  }

  // Activate email list.
  const coupon = await activateEmailSubscribe(hash);

  return json({ coupon });
};

export const CatchBoundary = () => {
  const caught = useCatch()
  return (
    <>
      <div>
        {caught.data.message}
      </div>
    </>
  )
}

function ConfirmSubscription() {
  const { coupon } = useLoaderData();

  return (
    <div className="h-[660px] relative">
      <div className="
        absolute top-[50%] left-1/2 transform translate-x-[-50%] translate-y-[-50%]
        min-h-[28rem] flex flex-col justify-center items-center
      ">
        <h1 className="font-black font-poppins text-3xl text-center mb-6">
          You've confirmed subscription on PeasyDeal
        </h1>

        <p className="font-poppins text-xl text[#343434] leading-2">
          Your coupon can now be used!
        </p>

        <div className="mt-8 gap-2">
          <CouponBox>
            <b className="font-poppins"> {coupon} </b>
          </CouponBox>

        </div>

        <div className="mt-8">
          {/*continue shopping button*/}
          <Link to="/">
            <Button colorScheme='pink'>
              Let's go shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSubscription