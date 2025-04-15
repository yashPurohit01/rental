'use client';
import React from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { persistor, store } from '@/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';

const theme = createTheme({
  primaryColor: 'orange'
});

function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="light"
    >
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          {children}
          <Toaster position='top-right' richColors />
        </PersistGate>
      </Provider>
    </MantineProvider>
  );
}

export default ProviderWrapper;
