
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
function CheckoutSuccess() {
  return (
    <div>
      payment success
    </div>
  );
};

export default CheckoutSuccess