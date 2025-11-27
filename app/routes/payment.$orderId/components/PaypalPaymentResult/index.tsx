import Success from '~/routes/payment.$orderId/components/Success';

interface PaypalPaymentResultProps {
  orderID: string;
}

export default function PaypalPaymentResult({ orderID }: PaypalPaymentResultProps) {
  return (<Success orderId={orderID} paymentMethod="paypal" />);
}
