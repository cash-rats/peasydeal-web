import Success from '../Success';

interface PaypalPaymentResultProps {
  orderID: string;
}

export default function PaypalPaymentResult({ orderID }: PaypalPaymentResultProps) {
  return (<Success orderId={orderID} paymentMethod="paypal" />);
}