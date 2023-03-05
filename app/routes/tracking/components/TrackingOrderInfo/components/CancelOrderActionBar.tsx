import {
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  List,
  ListItem,
  useDisclosure,
} from '@chakra-ui/react';

interface CancelReason {
  reason: string;
};

const cancelReasons: CancelReason[] = [
  {
    reason: 'I\'ve had wrong contact or shipping information on this order.',
  },
  {
    reason: 'I bought wrong items',
  },
  {
    reason: 'Found cheaper price somewhere else',
  },
  {
    reason: 'Found cheaper price somewhere else',
  },
];

export default function CancelOrderActionBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="mt-4">
      <Modal
        onClose={onClose}
        isOpen={true}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <h2 className="font-poppins font-bold text-lg">
              Please tell us reason for canceling?
            </h2>

            <List className="mt-6" spacing={1}>
              {
                cancelReasons.map((reason, index) => {
                  return (
                    <ListItem key={`cancel_reason_${index}`}>
                      {reason.reason}
                    </ListItem>
                  )
                })
              }
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Stack
        direction='row'
        alignItems='center'
        justify='right'
      >
        <Button
          colorScheme='orange'
          size='md'
          onClick={onOpen}
        >
          Cancel Order
        </Button>
      </Stack>
    </div>

  );
};