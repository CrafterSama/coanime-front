import { useEffect } from 'react';

import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from '@/components/error-boundary';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';
import { getQueryClient } from '../lib/query-client';

import '@/styles/app.css';

// CSS de librerías de terceros - copiados localmente para evitar problemas de transpilado con Sucrase
import '@/styles/vendor/react-widgets.css';
import '@/styles/vendor/suneditor.css';

import { AppProps } from 'next/app';

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session?: any; [key: string]: any } }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Usar QueryClient singleton para evitar recreación en cada render
  const queryClient = getQueryClient();

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <NextNProgress color="#ff7b00" />
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'bg-white rounded-md shadow-xl text-sm',
                duration: 4000,
                style: {
                  marginTop: '30px',
                },
              }}
            />
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
            <Component {...pageProps} />
          </HydrationBoundary>
        </QueryClientProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default App;
