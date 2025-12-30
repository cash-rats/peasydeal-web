import SimpleModal from '~/components/SimpleModal';
import type { ApiErrorResponse } from '~/shared/types';
import imageBg from './images/email_subscription.png';

interface SubscribeModalParams {
  open: boolean;
  onClose: () => void;
  error: ApiErrorResponse | null;
}

function SubscribeModal({ open, onClose, error }: SubscribeModalParams) {
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Thank you for subscribing!"
      size="md"
    >
      <div className="font-poppins text-center text-base">
        {error !== null ? (
          <p>Something went wrong! Please check the email you entered and try again.</p>
        ) : (
          <>
            <img
              src={imageBg}
              alt="Email subscription successful"
              className="mx-auto mb-2"
            />
            <p>A confirmation link and coupon have been sent to your email.</p>
            <br />
            <p>
              Please check your email for <b>£3 GBP voucher code</b> and click the{' '}
              <b>Confirm &amp; Validate</b> button in the email to activate your voucher.
            </p>
          </>
        )}
      </div>
    </SimpleModal>
  );
}

export default SubscribeModal;
