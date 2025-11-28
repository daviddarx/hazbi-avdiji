import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script id='dark-mode-detection' strategy='beforeInteractive'>
          {`
            (function() {
              const theme = localStorage.theme;
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

              if (theme === 'dark' || (theme !== 'light' && prefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `}
        </Script>
      </body>
    </Html>
  );
}
