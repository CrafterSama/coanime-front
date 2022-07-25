import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import NextNProgress from 'nextjs-progressbar';

import '@/styles/DateTimePicker.css';
import '@/styles/Calendar.css';
import '@/styles/Clock.css';
import '@/styles/app.css';

const App = ({ Component, pageProps }) => {
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
      <>
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
      </>
    </QueryClientProvider>
  );
};

export default App;
