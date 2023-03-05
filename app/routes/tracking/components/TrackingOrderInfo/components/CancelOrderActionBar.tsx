import { useState } from 'react';
import {
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  List,
  ListItem,
  ListIcon,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import clsx from 'clsx';
import { useFetcher } from '@remix-run/react';

interface CancelReason {
  reason: string;
};

const cancelReasons: CancelReason[] = [
  {
    reason: 'I\'ve had wrong contact or shipping information on this order.',
  },
  {
    reason: 'I bought the wrong items',
  },
  {
    reason: 'Found cheaper price somewhere else',
  },
  {
    reason: 'Other reasons',
  },
];

export default function CancelOrderActionBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="mt-4">
      <Modal
        onClose={onClose}
        isOpen={true}
        size='xl'
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="py-2">
          <ModalBody className="pb-4">
            <h2 className="font-poppins font-bold text-lg">
              Please tell us reason for canceling? (Optional)
            </h2>

            <List className="mt-4" spacing={1.5}>
              {
                cancelReasons.map((reason, index) => {
                  return (
                    <ListItem
                      key={`cancel_reason_${index}`}
                      onClick={() => setSelected(`cancel_reason_${index}`)}
                      className={clsx(
                        `
                          w-full min-h-[32px]
                          flex items-center cursor-pointer
                          py-[3px] px-[6px] box-border bg-white
                          transition-colors duration-[200ms] font-poppins
                          hover:bg-gray-100 hover:border-[#39CCCC] hover:border
                          hover:py-[2px] hover:px-[5px] hover:rounded-md
                        `,
                        {
                          "bg-gray-100 border-[#39CCCC] border py-[2px] px-[5px] rounded-md": selected === `cancel_reason_${index}`,
                        }
                      )}>
                      <ListIcon as={AiOutlineExclamationCircle} color="green.500" />
                      {reason.reason}
                    </ListItem>
                  )
                })
              }
            </List>

            {
              selected === `cancel_reason_3` && (
                <div className="mt-4">
                  <Textarea
                    placeholder='Please tell us the reason for canceling'
                    resize='none'
                  />

                  <div className="flex justify-end mt-[2px]">
                    <small className="font-poppins text-sm">
                      150 characters limit
                    </small>
                  </div>
                </div>
              )
            }

            {/* Actions, Confirm Cancel */}
            <Stack
              className="mt-4"
              direction='row'
              alignItems='center'
              justifyContent='end'
            >
              <Button colorScheme='gray'>
                Confirm
              </Button>
            </Stack>
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