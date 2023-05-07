import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

import type { ApiErrorResponse } from '~/shared/types';
import imageBg from './images/email_subscription.png'

interface SubscribeModalParams {
  open: boolean;
  onClose: () => void;
  error: ApiErrorResponse | null;
}

function SubscribeModal({ open, onClose, error }: SubscribeModalParams) {
  return (
    <Modal
      isCentered
      closeOnOverlayClick
      isOpen={open}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Thank you for subscrbing!
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <div className="pb-4">
            <div className="font-poppins text-base text-center justify-center gap-2">
              {
                error !== null
                  ? 'Something went wrong! Please check the email your entered and try again.'
                  : (
                    <>
                    <img src={imageBg} alt="email subscribe successfull" className='mx-auto mb-2'/>
                    <p>An confirmation link and coupon has send to your email.</p>
                    <br/>
                    <p>Please check your email for <b>£3 GBP voucher code</b> and click the <b>Confirm & Validate</b> button in the email to activate your voucher.</p>
                  </>)
              }
            </div>

            <div className="flex justify-end  mt-4">
              <Button onClick={onClose}>
                close
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SubscribeModal;