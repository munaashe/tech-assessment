import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store'
import RootLayout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </PersistGate>
      </Provider>
    </div>
  )
}
