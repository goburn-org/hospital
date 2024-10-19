import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PageLoader from './component/page-loader';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { router } from './router';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<PageLoader />} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" gutter={3} />
    </QueryClientProvider>
  </StrictMode>,
);
