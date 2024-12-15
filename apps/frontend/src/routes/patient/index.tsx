import { Outlet, useNavigate } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { PageSubHeader } from '../../component/page-sub-header';
import { ConsultationTile } from '../../features/patient/consultation-tile';
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
              title="Patient"
              newButton={{
                label: 'New Patient',
                onClick: () => navigate(routerConfig.New),
              }}
            />
            <div className="mt-8">
              <div className="flex flex-col gap-4 sm:px-6 lg:px-8">
                <ConsultationTile />
                <PatientTable />
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </Body>
    </>
  );
};
