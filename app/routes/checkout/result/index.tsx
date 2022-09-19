// useEffect(() => {
//   if (!stripe) return;

//   const clientSecret = new URLSearchParams(window.location.search).get(
//     "payment_intent_client_secret"
//   );

//   if (!clientSecret) {
//     return;
//   }

//   stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//     switch (paymentIntent.status) {
//       case "succeeded":
//         setMessage("Payment succeeded!");
//         break;
//       case "processing":
//         setMessage("Your payment is processing.");
//         break;
//       case "requires_payment_method":
//         setMessage("Your payment was not successful, please try again.");
//         break;
//       default:
//         setMessage("Something went wrong.");
//         break;
//     }
//   }, [stripe]);
// });
/*
  TODOs
    - [ ] Retrieve order items from server.
    - [ ] Provide a link for customer to trace their package.
    - [x] Continue shopping button.
    - [ ] List of purchased products
*/
import styles from './styles/CheckoutResult.css';
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
}

function CheckoutResult() {
  return (
    <div className="checkout-result-container">
      <div className="checkout-result-content">
        <div className="success-icon">
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 60 }}
          />
        </div>

        <h1 className="title">
          Your order has been placed
        </h1>

        <p className="text">
          An email of your order detail has been sent to huangchiheng@gmail.com
        </p>

        <p className="text">
          Please keep your order number. You can trace your package with order number
          <span>
            <Link to='/'> here </Link>.
          </span>
        </p>

        <div className="continue-shopping-btn">
          <Button variant="contained">
            Continue Shopping
          </Button>
        </div>

        {/* Order Detail */}
        <div className="order-detail-container">
          <h1>
            Order details
          </h1>

          <div className="order-detail-content">
            <div className="order-detail-row">
              <div className="order-title">
                Order number:
              </div>

              <div className="data">
                86
              </div>
            </div>

            <div className="order-detail-row">
              <div className="order-title">
                Date
              </div>
              <div className="data">
                May 6, 2017
              </div>
            </div>

            <div className="order-detail-row">
              <div className="order-title">
                Payment method
              </div>
              <div className="data">
                Credit Card
              </div>
            </div>
            <Divider />

            {/* Amount */}
            <div className="amount-content">
              <div className="amount-left" />
              <div className="amount-right" >

                <div className="amount-row">
                  <label>
                    Subtotal
                  </label>

                  <div className="data">
                    $69
                  </div>
                </div>

                <div className="amount-row">
                  <label>
                    Taxes(20%)
                  </label>

                  <div className="data">
                    $69
                  </div>
                </div>

                <div className="amount-row">
                  <label>
                    Total
                  </label>

                  <div className="data">
                    $100
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Product summary */}
        <div className="product-summary-container">
          <h1>
            Products Summary
          </h1>
          <div className="product-content">
            <div className="product-row">
              <div className="left">
                <label>
                  1 X some product
                </label>
                <p>
                  some product intro
                </p>
              </div>

              <div className="right">
                $60
              </div>
            </div>
            <Divider />
            <div className="product-row">

              <div className="left">
                <label>
                  1 X some product
                </label>
                <p>
                  some product intro
                </p>
              </div>

              <div className="right">
                $60
              </div>
            </div>

          </div>
        </div>

        {/* Order summary*/}
        <div className="customer-detail-container">
          <h1>
            Order Information
          </h1>
          <div className="customer-detail">
            <div className="contact">
              <h2>
                contact
              </h2>

              <div className="content">
                <span> Email: huangchiheng@gmail.com </span>
                <span> Phone: 12345678 </span>
              </div>
            </div>

            <div className="billing-address">
              <h2>
                billing address
              </h2>

              <div className="content">
                <span> Andrei Dorin </span>
                <span> some address </span>
                <span> some address 2 </span>
                <span> some zip code </span>
                <span> some country </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CheckoutResult