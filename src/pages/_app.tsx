import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { useRouter } from 'next/router';
import Script from 'next/script';
import NextNProgress from 'nextjs-progressbar';

import { GA_TRACKING_ID, pageview } from '../lib/gtag';

import '@/styles/DateTimePicker.css';
import '@/styles/Calendar.css';
import '@/styles/Clock.css';
import '@/styles/app.css';

const App = ({ Component, pageProps: { ...pageProps } }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 30000,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <NextNProgress color="#ff7b00" />
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              'bg-white rounded-md border border-gray-300 shadow-xl text-sm',
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
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;
