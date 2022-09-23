import type { ReactElement } from 'react';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useSnackbar } from 'react-simple-snackbar';

const successOptions = {
  position: 'top-right',
  style: {
    position: 'absolute',
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    top: '80px',
    right: '0',
    color: '#FFF',
    fontFamily: 'Menlo, monospace',
    fontSize: '16px',
    textAlign: 'center',
  },
  closeStyle: {
    display: 'none',
  },
};

const errorOptions = {
  position: 'top-right',
  style: {
    position: 'absolute',
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    top: '80px',
    right: '0',
    color: '#FFF',
    fontFamily: 'Menlo, monospace',
    fontSize: '16px',
    textAlign: 'center',
  },
  closeStyle: {
    display: 'none',
  },
}

interface SuccessSnackBarProps {
  onClose?: (event: React.SyntheticEvent) => void;
  message: ReactElement | string;
};

function SuccessSnackBar({ onClose, message }: SuccessSnackBarProps) {
  return (
    <MuiAlert
      severity='success'
      onClose={onClose}
    >
      {message}
    </MuiAlert>
  );
}

const useSuccessSnackbar = () => {
  const [open, close] = useSnackbar(successOptions);
  const openSuccessSnackbar = (message: ReactElement | string) => open(<SuccessSnackBar message={message} onClose={close} />);
  return [openSuccessSnackbar, close];
};

interface ErrorSnackBarProps {
  onClose?: (event: React.SyntheticEvent) => void;
  message: ReactElement | string;
};

function ErrorSnackBar({ onClose, message }: ErrorSnackBarProps) {
  return (
    <MuiAlert
      severity='error'
      onClose={onClose}
    >
      <AlertTitle>
        Error
      </AlertTitle>
      {message}
    </MuiAlert>
  );
}

const useErrorSnackbar = () => {
  const [open, close] = useSnackbar(errorOptions);
  const openErrorSnackbar = (message: string | ReactElement) => open(<ErrorSnackBar onClose={close} message={message} />);
  return [openErrorSnackbar, close];
}

export { useSuccessSnackbar, useErrorSnackbar };

