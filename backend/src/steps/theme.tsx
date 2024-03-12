import { createTheme } from '@xtreamsrl/react-ui-kit/theme';
import { ThemeProvider as UiKitThemeProvider } from '@xtreamsrl/react-ui-kit/theme';
import React from 'react';

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  palette: {
    background: {
      default: '#F4F5FC',
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
      '1': '#f3f4ff',
      '2': '#e0e2ff',
      '3': '#eff2fe',
      '4': '#e2e6fd',
      '5': '#cad1fb',
      '6': '#aab2f7',
      '7': '#888bf1',
      '8': '#716be9',
      '9': '#5f4ddb',
      '10': '#5341c1',
      '11': '#44379c',
      '12': '#3b337c',
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
