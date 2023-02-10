import { FiMail } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

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
    <div className="w-full grid grid-cols-2 bg-[#EEEEEE]">
      <div className="
          flex flex-col justify-start items-center p-14
          box-border
          border-t-[1px] border-t-[#BABABA]
          border-r-[1px] border-r-[#BABABA]
        ">
        <h1 className="font-bold text-[24px] mb-10 capitalize">
          Help and service
        </h1>

        <div className="flex flex-cols gap-9">
          <div className="flex items-center gap-2">
            <FiMail fontSize={28} />
            <p className="capitalize text-xl font-normal">
              contact us
            </p>
          </div>

          <div className="flex flex-cols">
            <div className="flex items-center gap-2">
              <MdOutlineLocalShipping color='black' fontSize={28} />
              <p className="capitalize text-xl font-normal">
                track your order
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="
          flex flex-col justify-start items-center p-14
          border-t-[1px] border-t-[#BABABA]
        ">
        <h1 className="font-bold text-[24px] capitalize">
          Payment methods
        </h1>

        <ul className="list-none flex flex-row mt-8">
          {
            paymentMethod.map((m, idx) => (
              <li
                className="m-[0.625rem]"
                key={idx}
              >
                <img
                  className="w-[38px] h-[24px]"
                  alt={m.alt}
                  src={m.src}
                />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default FooterTopInfo;