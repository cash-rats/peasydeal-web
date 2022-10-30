import type { CSSProperties } from 'react';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SyncLoader from 'react-spinners/SyncLoader';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 300,
  maxHeight: 200,
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '4px',
  p: 4,
  display: 'flex'
};

const spinnerOverride: CSSProperties = {
  margin: "auto",
};

interface LoadingModalProps {
  open?: boolean;
}

export default function LoadingModal({ open = true }: LoadingModalProps) {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
    >
      <Box sx={style}>
        <SyncLoader color='#999' cssOverride={spinnerOverride} />
      </Box>
    </Modal>
  )
}