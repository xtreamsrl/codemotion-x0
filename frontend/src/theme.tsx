import { createTheme } from '@xtreamsrl/react-ui-kit/theme';
import { ThemeProvider as UiKitThemeProvider } from '@xtreamsrl/react-ui-kit/theme';
import React from 'react';

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  palette: {
    background: {
      default: '#fefcef',
    },
    secondary: {
      '1': '#ebfde8',
      '2': '#d3f9ce',
      '3': '#aaf4a2',
      '4': '#77ea6c',
      '5': '#43db37',
      '6': '#29c220',
      '7': '#1b9b15',
      '8': '#177615',
      '9': '#43db37',
      '10': '#29c220',
      '11': '#143e13',
      '12': '#072c08',
    },
    brand: {
      '1': '#fefcef',
      '2': '#fefcef',
      '3': '#fef8de',
      '4': '#fdf5ce',
      '5': '#fdf1be',
      '6': '#fceeae',
      '7': '#fbe78d',
      '8': '#fae06c',
      '9': '#f9dc5c',
      '10': '#e0c653',
      '11': '#e0c653',
      '12': '#c7b04a',
      contrastText: '#000000',
    },
    grey: {
      3: '#d9e1e7',
      6: '#DFE3E6',
      9: '#9fa9bc',
      12: '#384455',
    },
  },
});


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <UiKitThemeProvider theme={theme}>{children}</UiKitThemeProvider>;
}
