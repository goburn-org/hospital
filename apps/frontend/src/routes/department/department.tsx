import { Outlet, useNavigate } from 'react-router-dom';
import { PageSubHeader } from '../../component/page-sub-header';
import { DepartmentTable } from '../../features/department/department-table';
import { routerConfig } from '../../utils/constants';

export const Component = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-6">
      <div className="">
        <PageSubHeader
          title="Department"
          description="Mange all your department in one place"
          newButton={{
            label: 'New Department',
            onClick: () => {
              navigate(routerConfig.New);
            },
          }}
        />
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <DepartmentTable />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
