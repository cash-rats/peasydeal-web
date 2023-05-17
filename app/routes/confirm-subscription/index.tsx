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

import subscribeBG from '~/images/mailing-bg.png';


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
    <div>
      <div className='bg-[#f9e8ee] w-full'>
        <img src={subscribeBG} alt='subscribe-background' className='w-full max-w-[480px] p-4 mx-auto' />
        <div className="w-full py-8 px-4 max-w-screen-md mx-auto translate-y-[-25%]">
          <div className="peasydeal-v1 py-8 bg-white rounded-2xl w-full p-8 shadow-lg">
            <section className="relative text-center">
              <h2 className="mb-4 px-5 text-center font-custom text-3xl font-bold max-w-4xl md:leading-tight mx-auto">
                You've confirmed subscription on PeasyDeal
              </h2>
              <p className="font-poppins text-xl text[#343434] leading-2 text-center">
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
                  <Button className="
                    rounded-lg h-full py-4 px-6 sm:px-12
                    whitespace-nowrap text-base font-bold lg:text-lg text-white shadow-lg
                    hover:opacity-90 transition focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ backgroundColor: "#d02e7d" }}
                  >
                    Let's go shopping
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSubscription