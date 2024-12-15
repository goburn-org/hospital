import { Outlet } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { PageSubHeader } from '../../component/page-sub-header';
import { PatientBillingTable } from '../../features/patient/patient-billing-table';

export const Component = () => {
  return (
    <>
      <Header />
      <Body>
        <div className="flex flex-col gap-8 px-4 sm:px-6">
          <div className="">
            <PageSubHeader title="Dashboard" />
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <PatientBillingTable />
                </div>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </Body>
    </>
  );
};
