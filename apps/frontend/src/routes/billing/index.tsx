import { Outlet, useNavigate } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { PageSubHeader } from '../../component/page-sub-header';
import { PatientTable } from '../../features/patient/patient-table';
import { routerConfig } from '../../utils/constants';

export const Component = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Body>
        <div className="flex flex-col gap-8 px-4 sm:px-6">
          <div className="">
            <PageSubHeader
              title="Billing"
              newButton={{
                label: 'New Billing',
                onClick: () => navigate(routerConfig.New),
              }}
            />
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <PatientTable />
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
