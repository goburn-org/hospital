import { classNames } from '../utils/classNames';
import { Link, useLocation } from 'react-router-dom';

export const Tabs = ({
  tabs,
  defaultTab,
}: {
  defaultTab?: string;
  tabs: {
    name: string;
    href: string;
    icon: any;
  }[];
}) => {
  const location = useLocation();
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          defaultValue={defaultTab}
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                aria-current={
                  location.pathname.includes(tab.href) ? 'page' : undefined
                }
                className={classNames(
                  location.pathname.includes(tab.href)
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
                )}
              >
                <tab.icon
                  aria-hidden="true"
                  className={classNames(
                    location.pathname.includes(tab.href)
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    '-ml-0.5 mr-2 h-5 w-5',
                  )}
                />
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
