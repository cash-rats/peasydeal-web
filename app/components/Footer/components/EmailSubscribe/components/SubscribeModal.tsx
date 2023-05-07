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
            <p className="font-poppins text-base">
              {
                error !== null
                  ? 'An confirmation link and coupon has send to your email.'
                  : 'Something went wrong! Please check the email your entered and try again.'
              }
            </p>

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