import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = ({ params }) => {
  const { orderId } = params;
  console.log('debug result loader', params);
  return null;
}

export default function PaymentResultLoader() {
  return (
    <div>
      payment result loader.
    </div>
  )
}