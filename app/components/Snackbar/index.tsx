import { useSnackbar } from 'react-simple-snackbar';

const successOptions = {
	position: 'bottom-right',
  style: {
    backgroundColor: '#64BBA0',
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
	position: 'bottom-right',
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

