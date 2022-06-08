import { createTheme, ThemeOptions } from '@mui/material';

export const themeOptions = createTheme({
  typography: {
    fontFamily: 'PingFang SC',
  },
  palette: {
    // type: 'light',
    primary: {
      main: '#6b8fe6',
    },
    secondary: {
      main: '#f50057',
    },
  },
});