import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { VscArrowLeft } from "react-icons/vsc";

import Autocomplete from './Autocomplete';

interface MobileSearchDialogProps {
  onBack?: () => void;

  isOpen: boolean;
}

function MobileSearchDialog({
  isOpen = false,
  onBack = () => { },
}: MobileSearchDialogProps) {
  return (
    <Modal
      scrollBehavior='inside'
      size='full'
      isOpen={isOpen}
      onClose={onBack}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <div>
            <div className="p-2 flex justify-end">

              {/* Back Button */}
              <IconButton
                aria-label='Back'
                onClick={onBack}
                icon={<VscArrowLeft style={{ fontSize: '32px' }} />}
              />

              {/* Autocomplete search bar */}
              <div className="w-full ml-[10px]">
                <Autocomplete
                  placeholder='Search'
                  openOnFocus
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileSearchDialog;