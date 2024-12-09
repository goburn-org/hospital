import {
  BanknotesIcon,
  IdentificationIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { lazy, Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import PatientIcon from '../../../asset/patient.svg?react';
import { Body } from '../../../component/body';
import { Header } from '../../../component/header';
import PageLoading from '../../../component/page-loader';
import { Tabs } from '../../../component/page-tabs';
import { classNames } from '../../../utils/classNames';
import { routerConfig } from '../../../utils/constants';

const secondaryNavigation = [
  {
    name: 'Out Patient Report',
    icon: () => (
      <PatientIcon className="group-hover:text-indigo-600 fill-gray-400 group-hover:fill-indigo-600" />
    ),
    children: [
      {
        icon: UserIcon,
        name: 'Patient',
        child: lazy(() =>
          import('../../../features/billing/out-patient/patient-report').then(
            (i) => ({
              default: i.PatientReport,
            }),
          ),
        ),
      },
      {
        icon: IdentificationIcon,
        name: 'Order / Department',
        child: lazy(() =>
          import(
            '../../../features/billing/out-patient/order-wise-report'
          ).then((i) => ({
            default: i.OrderWiseReport,
          })),
        ),
      },
    ],
  },
  {
    name: 'Cash/Card Balance',
    icon: BanknotesIcon,
    child: lazy(() =>
      import('../../../features/billing/out-patient/cash-card-report').then(
        (i) => ({
          default: i.CashCardReport,
        }),
      ),
    ),
  },
];

export const Component = () => {
  const [currentSidebar, setCurrentSideBar] = useState(
    secondaryNavigation[0].name,
  );
  const [currentChild, setCurrentChild] = useState(
    secondaryNavigation[0].children?.[0].name,
  );
  const selectedNav = secondaryNavigation.find(
    (n) => n.name === currentSidebar,
  );
  const Component = selectedNav?.child
    ? selectedNav.child
    : (selectedNav?.children?.find((c) => c.name === currentChild)?.child ??
      (() => null));
  return (
    <>
      <Header />
      <Body className="py-1">
        <div className="flex flex-row gap-2 px-4 sm:px-6">
          <aside className="h-[calc(100vh-125px)] flex overflow-x-auto border-b border-r border-gray-300 py-4 lg:block lg:w-64 lg:flex-none lg:border-b-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => {
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
                secondaryNavigation
                  .find((i) => i.name === currentSidebar)
                  ?.children?.map((i) => ({
                    ...i,
                    onClick: () => {
                      setCurrentChild(i.name);
                    },
                    active: i.name === currentChild,
                  })) ?? []
              }
            />
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  {
                    <Suspense fallback={<PageLoading />}>
                      <Component />
                    </Suspense>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </Body>
    </>
  );
};
