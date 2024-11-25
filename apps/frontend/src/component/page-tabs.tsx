import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../utils/classNames';
import { useLatest } from '../utils/use-latest';

interface LinkTab {
  name: string;
  href: string;
  icon?: any;
}

interface ButtonTab {
  name: string;
  onClick: () => void;
  icon?: any;
  active: boolean;
}

type Tab = LinkTab | ButtonTab;

const BaseTabs = <T extends Tab>({
  defaultTab,
  tabs,
  children,
}: {
  defaultTab?: string;
  tabs: T[];
  children: (tab: T) => JSX.Element;
}) => {
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
            {tabs.map((tab) => children(tab))}
          </nav>
        </div>
      </div>
    </div>
  );
};
const LinkTabs = ({
  tabs,
  defaultTab,
}: {
  defaultTab?: string;
  tabs: LinkTab[];
}) => {
  const location = useLocation();
  return (
    <BaseTabs tabs={tabs}>
      {(tab) => (
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
          {tab.icon ? (
            <tab.icon
              aria-hidden="true"
              className={classNames(
                location.pathname.includes(tab.href)
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500',
                '-ml-0.5 mr-2 h-5 w-5',
              )}
            />
          ) : null}
          <span>{tab.name}</span>
        </Link>
      )}
    </BaseTabs>
  );
};

const ButtonTabs = ({
  tabs,
  defaultTab,
}: {
  defaultTab?: string;
  tabs: ButtonTab[];
}) => {
  const tabRef = useLatest(tabs);
  useEffect(() => {
    if (defaultTab) {
      const tab = tabRef.current.find((tab) => tab.name === defaultTab);
      if (tab) {
        tab.onClick();
      }
    } else {
      tabRef.current[0].onClick();
    }
  }, [defaultTab, tabRef]);
  return (
    <BaseTabs tabs={tabs}>
      {(tab) => (
        <button
          key={tab.name}
          onClick={tab.onClick}
          aria-current={tab.active ? 'page' : undefined}
          className={classNames(
            tab.active
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
          )}
        >
          {tab.icon ? (
            <tab.icon
              aria-hidden="true"
              className={classNames(
                tab.active
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500',
                '-ml-0.5 mr-2 h-5 w-5',
              )}
            />
          ) : null}
          <span>{tab.name}</span>
        </button>
      )}
    </BaseTabs>
  );
};

export const Tabs = ({
  defaultTab,
  tabs,
}: {
  defaultTab?: string;
  tabs: Tab[];
}) => {
  const linkTabs = tabs.filter(
    (tab): tab is LinkTab => (tab as LinkTab).href !== undefined,
  );
  const buttonTabs = tabs.filter(
    (tab): tab is ButtonTab => (tab as ButtonTab).onClick !== undefined,
  );
  return (
    <div>
      {linkTabs.length > 0 && (
        <LinkTabs tabs={linkTabs} defaultTab={defaultTab} />
      )}
      {buttonTabs.length > 0 && (
        <ButtonTabs tabs={buttonTabs} defaultTab={defaultTab} />
      )}
    </div>
  );
};
