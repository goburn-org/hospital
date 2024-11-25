import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import PageLoader from './component/page-loader';
import { PatientVisitDetailsDrawer } from './features/patient/patient-visit-details-drawer';
import { PatientVisitDrawerProvider } from './provider/patient-drawer-context-provider';
import { router } from './router';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <PatientVisitDrawerProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<PageLoader />} />
        <PatientVisitDetailsDrawer />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-center" gutter={3} />
      </QueryClientProvider>
    </PatientVisitDrawerProvider>
  </StrictMode>,
);
