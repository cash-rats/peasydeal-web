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

const useSuccessSnackbar = () => useSnackbar(successOptions);
const useErrorSnackbar = () => useSnackbar(errorOptions)

export { useSuccessSnackbar, useErrorSnackbar };

