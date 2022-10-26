import { createTheme } from '@mui/material/styles';
// import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

console.log('createTheme', createTheme);

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ef5350',
    },
  },
});

export default theme;
