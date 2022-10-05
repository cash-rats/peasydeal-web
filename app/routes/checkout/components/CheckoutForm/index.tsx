import type { LinksFunction } from '@remix-run/node';
import { PaymentElement } from '@stripe/react-stripe-js';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';


import styles from './styles/CheckoutForm.css';
// import { transformOrderDetail } from './utils';
// import { createOrder } from './api';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface StripeCheckoutFormProps {
  loading?: boolean;
}

// TODO:
//  - [ ] error message.
//  - [ ] loading icon.
//  - [ ] payment form validation.
//  - [ ] [To submit payment on server](https://stripe.com/docs/payments/accept-a-payment-synchronously?html-or-react=react)
function StripeCheckoutForm({ loading = false }: StripeCheckoutFormProps) {
  return (
    <>
      <PaymentElement id="payment-element" />

      <div className="confirm-payment">
        <LoadingButton
          loading={loading}
          variant="contained"
          type="submit"
          fullWidth
        >
          CONFIRM
        </LoadingButton>
      </div>

      <div className="policies-container">
        <Divider />
        <div className="policies">
          <p className="promise">
            <span>
              <LockIcon fontSize='small' color='success' />
            </span>
            We won't store any of your card information.

          </p>

          <p className="promise">
            <span>
              <LockIcon fontSize='small' color='success' />
            </span>
            You payment is under SSL protection
          </p>

          <p className="promise">
            <span>
              <LockIcon fontSize='small' color='success' />
            </span>
            We use Stripe as our payment system which exceeds the most stringent field standards for security.
          </p>
        </div>
      </div>
    </>
  );
}

export default StripeCheckoutForm;