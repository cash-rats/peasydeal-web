import type { PaymentIntent } from '@stripe/stripe-js';
import { Link } from 'react-router';
import { ShieldCheck, TriangleAlert } from 'lucide-react';

import { Button } from '~/components/ui/button';

interface FailedProps {
  reason?: string;
  solution?: string;
  paymentStatus: PaymentIntent.Status;
};

const defaultReason = 'Whoops... looks like problem occurred on your payment';
const defaultSolution = 'Don\'t worry, nothing has been charged. Try checkout again, or contact customer service.';

function Failed({ reason = defaultReason, solution = defaultSolution, paymentStatus }: FailedProps) {
  return (
    <div className="w-full bg-gray-50 px-4 pb-14">
      <div className="mx-auto flex max-w-5xl flex-col justify-center py-8">
        <div className="flex flex-col items-center pt-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <TriangleAlert className="h-10 w-10 text-amber-700" aria-hidden />
          </div>

          <h1 className="mt-6 text-3xl font-semibold">
            {reason}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {solution}
          </p>

          <div className="mt-5 w-full max-w-md rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-emerald-700">
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-900">
                  You are not charged.
                </p>
                <p className="mt-1 text-sm text-emerald-800/80">
                  If you see a pending authorization, it should disappear automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {paymentStatus === 'requires_payment_method' ? (
              <Button
                asChild
                size="lg"
                className="bg-sky-600 text-white hover:bg-sky-700"
              >
                <Link to="/cart">Checkout again</Link>
              </Button>
            ) : null}

            <Button asChild size="lg" variant="outline">
              <Link to="/">Continue Shopping</Link>
            </Button>

            <Button asChild variant="link" className="h-auto p-0 text-sky-700">
              <Link to="/contact-us">Contact support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Failed;
