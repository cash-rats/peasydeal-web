import MuiAlert from '@mui/material/Alert';
import { useSnackbar } from 'react-simple-snackbar';

const successOptions = {
  position: 'top-right',
  style: {
    display: 'inline-block',
    position: 'absolute',
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    top: '120px',
    right: '0',
    color: '#FFF',
    fontFamily: 'Menlo, monospace',
    fontSize: '16px',
    textAlign: 'center',
  },
  closeStyle: {
    color: '#fff',
    fontSize: '16px',
  },
};

const errorOptions = {
  position: 'top-right',
  style: {
    backgroundColor: '#EC5E5E',
    color: '#FFF',
    fontFamily: 'Menlo, monospace',
    fontSize: '16px',
    textAlign: 'center',
  },
  closeStyle: {
    color: '#fff',
    fontSize: '16px',
  },
}

function SuccessSnackBar({ close }) {
  return (
    <MuiAlert
      severity='success'
      variant='filled'
      onClose={close}
    >
      Added to cart
    </MuiAlert>
  );
}

const useSuccessSnackbar = () => {
  const [open, close] = useSnackbar(successOptions);
  const openSuccessSnackbar = () => open(<SuccessSnackBar close={close} />)
  return [openSuccessSnackbar, close];
};

const useErrorSnackbar = () => useSnackbar(errorOptions)

export { useSuccessSnackbar, useErrorSnackbar };

