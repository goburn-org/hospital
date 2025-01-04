import { Outlet, useNavigate } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { PageSubHeader } from '../../component/page-sub-header';
import { GrnTable } from '../../features/pharmacy/grn-table';
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
              title="Goods Received Note"
              newButton={{
                label: 'New GRN',
                onClick: () => navigate(routerConfig.New),
              }}
            />
            <div className="mt-8">
              <div className="flex flex-col gap-4 sm:px-6 lg:px-8">
                <GrnTable />
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </Body>
    </>
  );
};
