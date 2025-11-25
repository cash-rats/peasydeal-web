import type { ReactNode } from 'react';
import SimpleModal from '~/components/SimpleModal';

interface LoadingModalProps {
  open?: boolean;
  showOverlay?: boolean
  overlayOpacity?: number;
  onClose?: () => void;
  children: ReactNode;
}

export default function LoadingModal({
  open = true,
  onClose,
  children,
  showOverlay = false,
  overlayOpacity = 60,
}: LoadingModalProps) {
  return (
    <SimpleModal
      open={Boolean(open)}
      onClose={onClose}
      overlayOpacity={overlayOpacity}
      showOverlay={showOverlay}
      title={undefined}
    >
      {children}
    </SimpleModal>
  );
}
