import type { ReactNode } from 'react';
import PaymentFailed from './index';

const Main = ({ children }: { children: ReactNode }) => (
  <main className="min-h-[35rem] pt-32 flex justify-center">
    {children}
  </main>
)

export default {
  requirePaymentMethod: (
    <Main>
      <PaymentFailed
        reason="Payment failed. Please try another payment method."
        solution="You will be redirected to checkout to input proper payment method"
        paymentStatus='requires_payment_method'
      />
    </Main>
  ),
  processing: (
    <Main>
      <PaymentFailed
        reason="Payment processing. We'll update you when payment is received."
        solution="You'll receive an email about your order detail once payment is processed"
        paymentStatus='processing'
      />
    </Main>
  )
}
