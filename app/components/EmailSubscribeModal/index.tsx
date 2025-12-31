import SimpleModal from '~/components/SimpleModal';
import type { ApiErrorResponse } from '~/shared/types';
import SubscribeResultCard from '~/components/EmailSubscribeModal/SubscribeResultCard';

interface SubscribeModalParams {
  open: boolean;
  onClose: () => void;
  error: ApiErrorResponse | null;
}

function SubscribeModal({ open, onClose, error }: SubscribeModalParams) {
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      size="md"
      showOverlay
      overlayOpacity={40}
      overlayClassName="backdrop-blur-sm"
      showCloseButton={false}
      showCloseIcon={false}
      contentClassName="border-0 bg-transparent p-0 shadow-none"
    >
      <SubscribeResultCard error={error} onClose={onClose} />
    </SimpleModal>
  );
}

export default SubscribeModal;
