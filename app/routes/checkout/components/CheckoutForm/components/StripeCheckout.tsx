import { PaymentElement } from '@stripe/react-stripe-js';
import type { StripePaymentElementChangeEvent, StripePaymentElement } from '@stripe/stripe-js';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import LockIcon from '@mui/icons-material/Lock';

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
            <LoadingButton
              disabled={disabled}
              loading={loading}
              variant="contained"
              type="submit"
              fullWidth
            >
              CONFIRM
            </LoadingButton>
          </div>

          <div className="policies-container">
            <Divider />
            <div className="policies">
              <p className="promise">
                <span>
                  <LockIcon fontSize='small' color='success' />
                </span>
                We won't store any of your card information.

              </p>

              <p className="promise">
                <span>
                  <LockIcon fontSize='small' color='success' />
                </span>
                You payment is under SSL protection
              </p>

              <p className="promise">
                <span>
                  <LockIcon fontSize='small' color='success' />
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