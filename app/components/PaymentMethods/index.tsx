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
];

const PaymentMethods = () => {
  return (
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
  )
}

export default PaymentMethods;
