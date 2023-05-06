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
import FiveHundredDisplay from './components/FiveHundredDisplay';


export const loader: LoaderFunction = async ({ request }) => {
  // Retrieve "uuid" query params
  const url = new URL(request.url);
  const hash = url.searchParams.get('uuid');

  // Display error page
  if (!hash) {
    throw json({ message: 'invalid subscription' }, { status: httpStatus.BAD_REQUEST })
  }

  // Activate email list.
  try {
    const coupon = await activateEmailSubscribe(hash);

    return json({ coupon });
  } catch (err: any) {
    throw json(JSON.parse(err.message), { status: httpStatus.INTERNAL_SERVER_ERROR });
  }
};

export const CatchBoundary = () => {
  const caught = useCatch()
  const errResp = caught.data;

  console.log('debug errResp', errResp);

  // Invalid email subscription
  return (
    <div className="h-[600px] relative">
      <div className="
        absolute top-[30%] left-1/2 transform translate-x-[-50%] translate-y-[-30%]
        min-h-[28rem] flex flex-col justify-center items-center
      ">
        {
          caught.status === httpStatus.BAD_REQUEST && (
            <>
              <h1 className="font-black font-poppins text-3xl text-center mb-6">
                Woops, no subscription to validate.
              </h1>

              <div className="font-poppins mt-2 text-[#343434]">
                How'd you get here? Back to
                <span className="font-poppins text-xl text-[#f0b021]">
                  <Link to='/'> Home Page </Link>
                </span>
              </div>
            </>
          )
        }

        {
          caught.status === httpStatus.INTERNAL_SERVER_ERROR && (
            <FiveHundredDisplay errResp={errResp} />
          )
        }
      </div>
    </div>
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
          Your coupon is can now be used!
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