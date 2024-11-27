import {
  Cog8ToothIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { Tabs } from '../../component/page-tabs';
import { routerConfig } from '../../utils/constants';

export const Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === routerConfig.SettingRoute) {
      navigate(routerConfig.Employee, {
        replace: true,
      });
    }
  }, [location.pathname, navigate]);
  return (
    <>
      <Header />
      <Body>
        <div className="flex flex-col gap-8 px-4 sm:px-6">
          <div className="">
            <Tabs
              defaultTab={routerConfig.Employee}
              tabs={[
                {
                  href: routerConfig.Employee,
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
      </Body>
    </>
  );
};
