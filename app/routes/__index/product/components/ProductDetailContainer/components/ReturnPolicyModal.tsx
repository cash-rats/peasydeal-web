import { Link } from '@remix-run/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from '@chakra-ui/react'

interface ReturnPolicyModalParams {
  isOpen: boolean;
  onClose?: () => void;
}

function ReturnPolicyModal({
  isOpen,
  onClose = () => { },
}: ReturnPolicyModalParams) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
      isCentered
    >

      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <h2 className="font-bold text-lg pb-3 border-b-[1px] border-b-[#E3E8EF]">
            Return policy
          </h2>

          <div className="px-4 pb-4 pt-2 mt-4">
            <ul className="list-disc font-poppins space-y-3">
              <li>
                Any item(s) in their original condition are eligible for a full refund within 14 days of purchase.
              </li>
              <li>
                The first return for EVERY order is free! For additional returns from the same order, shipping and handling fees may apply.
              </li>
            </ul>

            <div className="mt-3 flex items-center">
              <Link
                to="/return-policy"
                className="h-[21px] hover:border-b border-b-black"
              >
                Read full return policy
              </Link>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReturnPolicyModal;