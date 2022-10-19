import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // main: '#11cdef',
      main: '#60a4e8',
      contrastText: '#ffffff',
    },
    secondary: {
      // main: '#8965e0',
      // main: '#5C6BC0',
      // main: '#607D8B',
      main: '#607D8B',
    },
    success: {
      main: '#2dce89',
    },
    error: {
      main: '#f5365c',
    },
    warning: {
      main: '#fb6340',
    },
    info: {
      main: '#007bff',
    },
  },
});

export default theme;
