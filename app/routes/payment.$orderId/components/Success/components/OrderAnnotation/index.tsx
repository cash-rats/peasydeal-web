import { Link } from 'react-router';
import { Check, ShoppingBag, Truck } from 'lucide-react';

import { Button } from '~/components/ui/button';

interface OrderAnnotationProps {
  email: string;
  orderUUID: string;
}

function OrderAnnotation({ email, orderUUID }: OrderAnnotationProps) {
  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <Check className="h-10 w-10 text-emerald-600" aria-hidden />
      </div>

      <h1 className="mt-6 text-3xl font-semibold">
        Your order has been placed!
      </h1>

      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Thank you for your purchase. An email confirmation has been sent to{' '}
        <span className="font-medium text-foreground">{email}</span>.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Button
          asChild
          size="lg"
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Link to="/">
            <ShoppingBag aria-hidden />
            Continue Shopping
          </Link>
        </Button>

        <Button asChild size="lg" variant="outline">
          <Link to={`/tracking?query=${orderUUID}`}>
            <Truck aria-hidden />
            Track your order
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default OrderAnnotation;
