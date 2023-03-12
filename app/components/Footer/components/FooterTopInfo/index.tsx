import { Link } from '@remix-run/react';
import { FiMail } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { Button } from '@chakra-ui/react'

import Amex from './images/american-express.svg';
import Visa from './images/visa.svg';
import MasterCard from './images/mastercard.svg';
import Paypal from './images/paypal.svg';
import Klarna from './images/klarna-1.svg';

const paymentMethod = [
  {
    src: Visa,
    alt: 'visa'
  },
  {
    src: Amex,
    alt: 'amex'
  },
  {
    src: MasterCard,
    alt: 'master card'
  },
  {
    src: Paypal,
    alt: 'paypal'
  },
  {
    src: Klarna,
    alt: 'klarna'
  },
]

function FooterTopInfo() {
  return (
    <div className="w-full bg-[#EEEEEE]">
      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-2">
        <div className="
          flex flex-col
          justify-start
          items-center
          px-2 md:px-6 lg:px-14
          py-8 md:px-14 lg:px-20
          box-border
          border-t-[1px] border-t-[#BABABA]
          border-r-[1px] border-r-[#BABABA]
        ">
          <h3 className="
            font-bold
            text-xl
            md:text-2xl
            mb-2 md:mb-3 lg:mb-4
            capitalize
          ">
            Help and service
          </h3>

          <div className="flex flex-col gap-2 md:gap-4 lg:gap-9 md:flex-row">
            <a
              className="flex flex-cols"
              aria-label='track order'
              href="mailto:contact@peasydeal.com"
            >
              <div className="flex font-semibold font-poppins items-center gap-1 cursor-pointer">
                <Button
                    leftIcon={<FiMail className="self-center text-lg md:text-xl" />}
                    colorScheme='teal'
                    size="sm"
                    variant='ghost'
                    className='capitalize text-md md:text-base ml-1.5'
                  >
                    Contac Us
                  </Button>
              </div>
            </a>

            <Link className="flex flex-cols" aria-label='track order' to="/tracking">
              <div className="flex font-semibold font-poppins items-center gap-1 cursor-pointer">
                <Button
                  leftIcon={<MdOutlineLocalShipping className="self-center text-lg md:text-xl" />}
                  colorScheme='teal'
                  size="sm"
                  variant='ghost'
                  className='capitalize text-md md:text-base ml-1.5'
                >
                  track your order
                </Button>
              </div>
            </Link>
          </div>
        </div>

        <div className="
            flex flex-col justify-start items-center
            px-2 py-8 md:px-14 lg:px-20
            border-t-[1px] border-t-[#BABABA]
        ">
          <h3 className="
            font-bold
            text-xl
            md:text-2xl
            mb-2 md:mb-3 lg:mb-4
            capitalize
          ">
            Payment methods
          </h3>

          <ul className="list-none flex flex-row flex-wrap justify-center">
            {
              paymentMethod.map((m, idx) => (
                <li
                  className="m-1.5"
                  key={idx}
                >
                  <img
                    className="
                      w-[34px] md:w-[38px]
                    "
                    alt={m.alt}
                    src={m.src}
                  />
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FooterTopInfo;