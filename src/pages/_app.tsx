import { Toaster } from 'react-hot-toast';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';

import '@/styles/DateTimePicker.css';
import '@/styles/Calendar.css';
import '@/styles/Clock.css';
import '@/styles/app.css';

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
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
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <NextNProgress color="#f90" />
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                'bg-white rounded-md border border-gray-300 shadow-xl text-sm',
              duration: 5000,
              style: {
                marginTop: '50px',
              },
            }}
          />
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;
