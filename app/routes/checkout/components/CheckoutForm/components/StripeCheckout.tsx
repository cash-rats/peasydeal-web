import { PaymentElement } from '@stripe/react-stripe-js';
import type {
  StripePaymentElementChangeEvent,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { FiLock } from 'react-icons/fi';

import { Button } from '~/components/ui/button';

interface StripeCheckoutProps {
  disabled?: boolean;
  onChange: (event: StripePaymentElementChangeEvent) => any
  onReady?: (element: StripePaymentElement) => any;
  loading?: boolean;
}

function StripeCheckout({
  disabled = false,
  onChange,
  onReady = () => { },
  loading = false,
}: StripeCheckoutProps) {
  return (
    <div className="form-container">
      {/* pricing panel */}
      <div className="pricing-panel">
        <div className="payment-form-container">
          <PaymentElement
            id="payment-element"
            options={{
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: false
              }
            }}
            onChange={onChange}
            onReady={onReady}
          />

          <div className="confirm-payment">
            <Button
              type="submit"
              className="w-full"
              disabled={disabled || loading}
            >
              {loading ? 'Processing...' : 'CONFIRM'}
            </Button>
          </div>

          <div className="policies-container">
            <div className="my-4 h-px w-full bg-slate-200" />
            <div className="policies">
              <p className="promise">
                <span>
                  <FiLock className="mr-1 inline-block h-4 w-4 text-emerald-600" />
                </span>
                We won't store any of your card information.
              </p>

              <p className="promise">
                <span>
                  <FiLock className="mr-1 inline-block h-4 w-4 text-emerald-600" />
                </span>
                You payment is under SSL protection
              </p>

              <p className="promise">
                <span>
                  <FiLock className="mr-1 inline-block h-4 w-4 text-emerald-600" />
                </span>
                We use Stripe as our payment system which exceeds the most stringent field standards for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StripeCheckout
