import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import {
  Cog6ToothIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PatientIcon from '../asset/patient.svg?react';
import { useAccountConfig } from '../provider/account/use-account-config';
import { classNames } from '../utils/classNames';
import { ProjectName, routerConfig } from '../utils/constants';
import { TIMER_XS } from '../utils/use-timer';
import Tooltip, { TooltipRef } from './tooltip';

const navigation = [
  {
    name: 'Patient',
    href: routerConfig.Patient,
    icon: PatientIcon,
    current: false,
  },
  {
    name: 'Billing',
    href: routerConfig.Billing,
    icon: ReceiptPercentIcon,
    current: false,
    children: [
      {
        name: 'Outpatient Billing',
        href: `${routerConfig.Billing}`,
      },
      {
        name: 'Report',
        href: `${routerConfig.Billing}/${routerConfig.Report}`,
      },
    ],
  },
  {
    name: 'Inventory',
    href: routerConfig.Inventory,
    icon: ShoppingCartIcon,
    current: false,
  },
];

const MobileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const { pathname } = useLocation();
  const { data } = useAccountConfig();
  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="-m-2.5 p-2.5"
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </button>
            </div>
          </TransitionChild>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
            <div className="flex h-48 shrink-0 items-center border-r-2 border-sidebar bg-white">
              <img
                alt={ProjectName}
                src={data?.hospitalImg}
                className="m-auto h-48 w-auto object-contain"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <ul>
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.children ? '#' : item.href}
                        className={
                          pathname === item.href ||
                          pathname.startsWith(item.href)
                            ? 'sidebar-nav-selected group'
                            : 'sidebar-nav-unselected group'
                        }
                        onMouseUp={() => {
                          setSidebarOpen(false);
                        }}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            pathname === item.href ||
                              pathname.startsWith(item.href)
                              ? 'text-white'
                              : 'text-indigo-300 group-hover:text-white',
                            'h-6 w-6 shrink-0',
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <li className="mt-auto">
                  <Link
                    to={routerConfig.SettingRoute}
                    className={classNames(
                      pathname.includes(routerConfig.SettingRoute)
                        ? 'bg-indigo-700'
                        : '',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-300 hover:bg-indigo-700 hover:text-white',
                    )}
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 text-indigo-300 group-hover:text-white"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const DesktopSidebar = () => {
  const { pathname } = useLocation();
  const { data } = useAccountConfig();
  const navigate = useNavigate();
  const ref = useRef<Record<string, TooltipRef | null>>({});
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-center px-2">
        <img
          alt="Logo"
          src={data?.hospitalImg}
          className="h-8 w-auto object-contain bg-white "
        />
      </div>
      <nav className="flex flex-1 flex-col h-[92%]">
        <ul className="flex flex-1 flex-col gap-y-7">
          {/* Navigation Items */}
          <ul className="flex flex-col items-center space-y-1">
            {navigation.map((item, idx) => (
              <Tooltip
                fix
                ref={(s) => {
                  ref.current[item.name] = s;
                }}
                id={item.name}
                key={item.name}
                stopAfter={item.children ? TIMER_XS : 0}
                text={
                  item.children ? (
                    <ul className="flex flex-col gap-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <button
                            onClick={() => {
                              navigate(child.href);
                              ref.current[item.name]?.stop();
                            }}
                            className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-800 hover:bg-indigo-900 hover:text-white"
                          >
                            {child.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    item.name
                  )
                }
                bgColor={item.children ? 'bg-gray-200' : ''}
              >
                <li>
                  <Link
                    to={item.children ? '#' : item.href}
                    className={classNames(
                      pathname === item.href || pathname.startsWith(item.href)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold',
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0"
                    />
                  </Link>
                </li>
              </Tooltip>
            ))}
          </ul>

          {/* Spacer to push settings item to the bottom */}
          <div className="flex-1"></div>

          {/* Settings Item */}
          <li className="flex flex-col items-center space-y-1">
            <Link
              to={routerConfig.SettingRoute}
              className={classNames(
                pathname.includes(routerConfig.SettingRoute)
                  ? 'bg-indigo-700'
                  : '',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-300 hover:bg-indigo-700 hover:text-white',
              )}
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-indigo-300 group-hover:text-white"
              />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  Sidebar.open = () => {
    setSidebarOpen(true);
  };
  return (
    <>
      <div className="2xl:hidden">
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      <div className="hidden sm:fixed sm:inset-y-0 sm:left-0 sm:z-50 sm:block sm:w-20 sm:overflow-y-auto sm:bg-gray-900 sm:pb-4">
        <DesktopSidebar />
      </div>
    </>
  );
};

Sidebar.open = () => {
  /*
    This function is defined inside the sidebar search for it.
    Sidebar.open = () => {
      setSidebarOpen(true);
    };
  */
};
