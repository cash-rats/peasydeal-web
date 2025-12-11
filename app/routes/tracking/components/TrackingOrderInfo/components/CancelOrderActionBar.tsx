import { useState } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import clsx from 'clsx';
import SimpleModal from '~/components/SimpleModal';
import { Button } from '~/components/ui/button';

export interface CancelReason {
  id?: number;
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
    reason: 'Found cheaper price elsewhere',
  },
  {
    reason: 'Other reasons',
  },
].map((cr, idx) => ({
  ...cr,
  id: idx,
}));

interface ICancelOrderActionBar {
  onConfirm?: (reason: CancelReason | null) => void;

  openCancelModal?: boolean;

  onOpen?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
};

export default function CancelOrderActionBar({
  onConfirm = () => { },
  openCancelModal = false,
  onOpen = () => { },
  onClose = () => { },
  isLoading = false,
}: ICancelOrderActionBar) {
  const [selected, setSelected] = useState<CancelReason | null>(null);
  const handleConfirm = () => onConfirm(selected);

  return (
    <div className="mt-4">
      <SimpleModal
        open={openCancelModal}
        showCloseButton={false}
        onClose={onClose}
        closeOnOverlayClick
        contentClassName="max-w-xl !p-0 shadow-lg"
      >
          <div className="p-4">
            <h2 className="font-poppins font-bold text-lg">
              Please tell us the reason for canceling? (Optional)
            </h2>

            <ul className="mt-4 space-y-1.5">
              {
                cancelReasons.map((reason) => {
                  return (
                    <li
                      key={`cancel_reason_${reason.id}`}
                      onClick={() => setSelected(reason)}
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
                          "bg-gray-100 border-[#39CCCC] border py-[2px] px-[5px] rounded-md": selected?.id === reason.id,
                        }
                      )}
                    >
                      <AiOutlineExclamationCircle className='text-[#4980c8] mr-2 text-lg' />
                      {reason.reason}
                    </li>
                  )
                })
              }
            </ul>

            {
              selected?.id === cancelReasons.length - 1 && (
                <div className="mt-4">
                  <textarea
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder='Please tell us the reason for canceling'
                    rows={4}
                    maxLength={150}
                  ></textarea>

                  <div className="flex justify-end mt-[2px]">
                    <small className="font-poppins text-sm">
                      150 characters limit
                    </small>
                  </div>
                </div>
              )
            }

            {/* Actions, Confirm Cancel */}
            <div
              className="mt-4 flex flex-row items-center justify-end"
            >
              <Button
                variant='secondary'
                onClick={handleConfirm}
                disabled={isLoading}
              >
                Confirm
              </Button>
            </div>
          </div>
      </SimpleModal>

      <div
        className="flex flex-row items-center justify-end"
      >
        <Button
          onClick={onOpen}
          className="bg-[#6366f1] px-6 text-white hover:bg-[#5154d6]"
        >
          Cancel Order
        </Button>
      </div>
    </div>

  );
};
