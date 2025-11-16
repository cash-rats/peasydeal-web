import type { ReactNode } from 'react';
import SimpleModal from '~/components/SimpleModal';

interface LoadingModalProps {
  open?: boolean;
  showOverlay?: boolean
  onClose?: () => void;
  children: ReactNode;
}

export default function LoadingModal({ open = true, onClose, children, showOverlay = false }: LoadingModalProps) {
  return (
    <SimpleModal
      open={Boolean(open)}
      onClose={onClose}
      overlayOpacity={60}
      showOverlay={showOverlay}
      title={undefined}
    >
      {children}
    </SimpleModal>
  );
}
