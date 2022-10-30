import type { ReactNode } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  maxHeight: 150,
  width: '100%',
  height: '100%',
  bgcolor: 'white',
  boxShadow: 24,
  borderRadius: '4px',
  p: 4,
  display: 'flex'
};

interface LoadingModalProps {
  open?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export default function LoadingModal({ open = true, onClose, children }: LoadingModalProps) {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      hideBackdrop
      disableScrollLock
    >
      <Box sx={style}>
        {children}
      </Box>
    </Modal>
  )
}