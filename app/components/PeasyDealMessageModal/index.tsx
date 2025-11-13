import type { ReactNode } from 'react';

import { Dialog, DialogContent } from '~/components/ui/dialog';

interface LoadingModalProps {
  open?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export default function LoadingModal({ open = true, onClose, children }: LoadingModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose?.();
        }
      }}
    >
      <DialogContent
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        className="
          max-w-sm
          w-full
          border-0
          bg-[#323131]
          text-white
          shadow-2xl
          sm:rounded
          p-4
          flex
          items-center
          justify-center
        "
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
