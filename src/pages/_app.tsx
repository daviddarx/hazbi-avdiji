import Layout from '@/components/layout/Layout';
import store, { uiActions } from '@/store';
import '@/styles/globals.css';
import { getSystem } from '@/utils/core';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pageKey = router.asPath;

  useEffect(() => {
    const system = getSystem();

    document.body.classList.add(system.os);
    document.body.classList.add(system.browser);

    store.dispatch(
      uiActions.setSystem({
        os: system.os,
        browser: system.browser,
      }),
    );
  });

  return (
    <Provider store={store}>
      <Layout {...pageProps}>
        <Component key={pageKey} {...pageProps} />
      </Layout>
    </Provider>
  );
}
