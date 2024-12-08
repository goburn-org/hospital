import {
  Cog8ToothIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Body } from '../../component/body';
import { Header } from '../../component/header';
import { Tabs } from '../../component/page-tabs';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';

const secondaryNavigation = [
  {
    name: 'User & Role',
    icon: UserIcon,
    children: [
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
    ],
  },
  {
    name: 'Inventory',
    icon: UserIcon,
    href: routerConfig.Inventory,
  },
];

export const Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedNav = secondaryNavigation.find((nav) =>
    nav.href
      ? location.pathname.includes(nav.href)
      : nav.children?.some((sub) => location.pathname.includes(sub.href)),
  );
  const [currentSidebar, setCurrentSideBar] = useState(
    selectedNav?.name ?? secondaryNavigation[0].name,
  );
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
        <div className="flex flex-row gap-2 px-4 sm:px-6">
          <aside className="h-[calc(100vh-125px)] flex overflow-x-auto border-b border-r border-gray-300 py-4 lg:block lg:w-64 lg:flex-none lg:border-b-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.href) {
                          navigate(item.href);
                        } else {
                          const [first] = item.children ?? [];
                          navigate(first.href);
                        }
                        setCurrentSideBar(item.name);
                      }}
                      className={classNames(
                        item.name === currentSidebar
                          ? 'bg-gray-100 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                        'w-full group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm/6 font-semibold',
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.name === currentSidebar
                            ? 'text-indigo-600 fill-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600 ',
                          'size-6 shrink-0',
                        )}
                      />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="w-full">
            <Tabs
              defaultTab={routerConfig.Employee}
              tabs={
                secondaryNavigation.find((i) => i.name === currentSidebar)
                  ?.children ?? []
              }
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
