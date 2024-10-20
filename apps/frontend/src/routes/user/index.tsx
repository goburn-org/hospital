import { Outlet } from 'react-router-dom';
import { routerConfig } from '../../utils/constants';
import { Tabs } from '../../component/page-tabs';
import {
  Cog8ToothIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export const Component = () => {
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-6">
      <div className="">
        <Tabs
          defaultTab={routerConfig.User}
          tabs={[
            {
              href: routerConfig.User,
              icon: UserIcon,
              name: 'User',
            },
            {
              href: routerConfig.Role,
              icon: Cog8ToothIcon,
              name: 'Role',
            },
            {
              href: routerConfig.Department,
              icon: IdentificationIcon,
              name: 'Department',
            },
          ]}
        />
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
