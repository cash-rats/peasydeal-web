import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { CheckCheck } from 'lucide-react';

import { Button } from '~/components/ui/button';

interface OrderAnnotationProps {
  email: string;
  orderUUID: string;
}

function Text({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 font-poppins text-center text-base text-[#7f7f7f]">
      {children}
    </p>
  )
}

function OrderAnnotation({ email, orderUUID }: OrderAnnotationProps) {
  return (
    <div className="flex flex-col">
      <div className="text-center">
        <CheckCheck className="h-[120px] w-[120px] text-emerald-500" />
      </div>

      <h1 className="text-center font-semibold text-3xl mt-4 font-poppins">
        Your order has been placed
      </h1>

      <Text>
        An email of your order detail has been sent to <b>{email}</b>
      </Text>

      <Text>
        Please keep your order number. You can trace your package with the order number.
      </Text>

      <div className="flex justify-center gap-6 mt-6">
        <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
          <Link to='/'>
            Continue Shopping
          </Link>
        </Button>

        <Button className="bg-sky-500 text-white hover:bg-sky-600">
          <Link to={`/tracking?query=${orderUUID}`}>
            Track you order
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default OrderAnnotation;
