import { Outlet, useNavigate } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { PageSubHeader } from '../../component/page-sub-header';
import { IntentWorkListTable } from '../../features/pharmacy/intent-worklist-table';
import { routerConfig } from '../../utils/constants';

export const Component = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Body className="py-5">
        <div className="flex flex-col gap-8 px-4 sm:px-6">
          <div className="">
            <PageSubHeader
              title="Intent"
              newButton={{
                label: 'New Intent',
                onClick: () => navigate(routerConfig.New),
              }}
            />
            <div className="mt-8">
              <div className="flex flex-col gap-4 sm:px-6 lg:px-8">
                <IntentWorkListTable />
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </Body>
    </>
  );
};
