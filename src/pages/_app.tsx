import { Toaster } from 'react-hot-toast';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import NextNProgress from 'nextjs-progressbar';

import '@/styles/DateTimePicker.css';
import '@/styles/Calendar.css';
import '@/styles/Clock.css';
import '@/styles/app.css';

const App = ({ Component, pageProps: { ...pageProps } }) => {
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
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;
