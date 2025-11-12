import { Link } from 'react-router';
import { FiMail } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

import Amex from './images/american-express.svg';
import Visa from './images/visa.svg';
import MasterCard from './images/mastercard.svg';
import Paypal from './images/paypal.svg';
import Klarna from './images/klarna-1.svg';
import EmailSubscribe from '../EmailSubscribe';
import { Button } from '~/components/ui/button';

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
    <div className="w-full bg-[#EEEEEE] border-t-[1px] border-t-[#d8d8d8]">
      <div className="w-full max-w-screen-md mx-auto">
        <section className='
          px-2
          py-8 md:px-14 lg:px-20
        '>
          <EmailSubscribe />
        </section>
      </div>
      <div className='border-t-[1px] border-t-[#d8d8d8]'/>
      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-2">
        <div className="
          flex flex-col
          justify-start
          items-center
          px-2
          py-8 md:px-14 lg:px-20
          box-border
          border-r-[1px] border-r-[#d8d8d8]
        ">
          <h3 className="
            font-bold
            text-xl
            md:text-2xl
            mb-2 md:mb-3 lg:mb-4
          ">
            Help and service
          </h3>

          <div className="flex flex-col gap-2 md:gap-4 lg:gap-9 md:flex-row">
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='flex items-center gap-2 font-semibold font-poppins capitalize text-md md:text-base'
            >
              <Link aria-label='contact us' to="/contact-us">
                <FiMail className="text-lg md:text-xl" />
                <span>Contact Us</span>
              </Link>
            </Button>

            <Button
              asChild
              variant='ghost'
              size='sm'
              className='flex items-center gap-2 font-semibold font-poppins capitalize text-md md:text-base'
            >
              <Link aria-label='track order' to="/tracking">
                <MdOutlineLocalShipping className="text-lg md:text-xl" />
                <span>track your order</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="
            flex flex-col justify-start items-center
            px-2 py-8 md:px-14 lg:px-20
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
