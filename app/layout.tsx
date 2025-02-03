import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { NavBar } from '../components/NavBar/NavBar';
import { theme } from '../theme';

export const metadata = {
  title: 'Fancy Dev',
  description: 'Just a place for fancy dev stuff',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <NavBar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
