import type { CSSProperties } from 'react';
import Box from '@mui/material/Box';
import SyncLoader from 'react-spinners/SyncLoader';

import GeneralModal from './index';


const spinnerOverride: CSSProperties = {
  margin: "auto",
};

const LoadingModal = () => {
  return (
    <GeneralModal>
      <SyncLoader color='#323131' cssOverride={spinnerOverride} />
    </GeneralModal>
  );
}

export default LoadingModal;

