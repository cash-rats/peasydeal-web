import type { CSSProperties } from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

import GeneralModal from './index';


const spinnerOverride: CSSProperties = {
  margin: 'auto',
};

const LoadingModal = () => {
  return (
    <GeneralModal showOverlay>
      <div
        className="
          flex
          w-full
          max-w-sm
          items-center
          justify-center
          rounded-xl
          bg-[#323131]
          p-4
          sm:p-6
          shadow-2xl
        "
      >
        <SyncLoader color="#f9fafb" cssOverride={spinnerOverride} />
      </div>
    </GeneralModal>
  );
}

export default LoadingModal;
