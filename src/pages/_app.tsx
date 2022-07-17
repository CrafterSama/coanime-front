import { QueryClient, QueryClientProvider } from 'react-query';

import NextNProgress from 'nextjs-progressbar';

import '@/styles/app.css';

const App = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <NextNProgress color="#f90" />
        <Component {...pageProps} />
      </>
    </QueryClientProvider>
  );
};

export default App;
