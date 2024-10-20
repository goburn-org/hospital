import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import {
  Cog6ToothIcon,
  HomeIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { classNames } from '../utils/classNames';
import { ProjectName, routerConfig } from '../utils/constants';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  {
    name: 'Dashboard',
    href: routerConfig.DashboardRoute,
    icon: HomeIcon,
    current: false,
  },
  {
    name: 'User Management',
    href: routerConfig.UserRoute,
    icon: UserCircleIcon,
    current: false,
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
                src="https://logowik.com/content/uploads/images/apollo-hospitals9684.jpg"
                className="m-auto h-48 w-auto object-cover"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <ul>
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
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
                            pathname == item.href ||
                              pathname.startsWith(item.href)
                              ? 'text-white'
                              : 'text-violet-300 group-hover:text-white',
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
                    to="#"
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-violet-300 hover:bg-gray-900 hover:text-white"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 text-violet-300 group-hover:text-white"
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
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar pb-6">
      <div className="flex shrink-0 items-center border-r-2 border-sidebar bg-white">
        <img
          alt={ProjectName}
          src="https://logowik.com/content/uploads/images/apollo-hospitals9684.jpg"
          className="m-auto h-48 w-auto object-cover"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <ul>
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={
                    pathname == item.href || pathname.startsWith(item.href)
                      ? 'sidebar-nav-selected group'
                      : 'sidebar-nav-unselected group'
                  }
                >
                  <item.icon
                    aria-hidden="true"
                    className={classNames(
                      pathname == item.href || pathname.startsWith(item.href)
                        ? 'text-white'
                        : 'text-violet-300 group-hover:text-white',
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
              to="#"
              className="group mx-3 flex gap-x-3 rounded-md bg-violet-100 p-2 text-sm font-semibold leading-6 text-black hover:bg-gray-900 hover:text-white"
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-black group-hover:text-white"
              />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
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
      <div className="hidden 2xl:fixed 2xl:inset-y-0 2xl:z-50 2xl:flex 2xl:w-64 2xl:flex-col">
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
