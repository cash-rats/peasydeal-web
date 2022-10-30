import type { CSSProperties } from 'react';
import Box from '@mui/material/Box';
import SyncLoader from 'react-spinners/SyncLoader';

import GeneralModal from './index';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  maxHeight: 120,
  width: '100%',
  height: '100%',
  bgcolor: 'white',
  boxShadow: 24,
  borderRadius: '4px',
  p: 4,
  display: 'flex'
};

const spinnerOverride: CSSProperties = {
  margin: "auto",
};

const LoadingModal = () => {
  return (
    <GeneralModal>
      <Box sx={style}>
        <SyncLoader color='#323131' cssOverride={spinnerOverride} />
      </Box>
    </GeneralModal>
  );
}

export default LoadingModal;

