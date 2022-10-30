import Backdrop from '@mui/material/Backdrop';
import SyncLoader from 'react-spinners/SyncLoader';

interface PeasyDealLoadingBackdropProps {
  open?: boolean
}

export default function PeasyDealLoadingBackdrop({ open = false }: PeasyDealLoadingBackdropProps) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <SyncLoader color='white' />
    </Backdrop>
  );
}