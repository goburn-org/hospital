import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils/classNames';

export type FormTab = {
  name: string;
  current: boolean;
  completed: boolean;
  inProgress: boolean;
};

const MobileTabs = ({
  tabs,
  setCurrentTab,
}: {
  tabs: FormTab[];
  setCurrentTab: (tabs: FormTab) => void;
}) => {
  return (
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">
        Select a tab
      </label>
      {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
      <select
        id="tabs"
        name="tabs"
        defaultValue={tabs.find((tab) => tab.current)!.name}
        onChange={(e) => {
          const selectedTab = tabs.find((tab) => tab.name === e.target.value);
          if (selectedTab) {
            setCurrentTab(selectedTab);
          }
        }}
        className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
      >
        {tabs.map((tab) => (
          <option key={tab.name}>{tab.name}</option>
        ))}
      </select>
    </div>
  );
};

const DesktopTabs = ({
  tabs,
  setCurrentTab,
}: {
  tabs: FormTab[];
  setCurrentTab: (tabs: FormTab) => void;
}) => {
  return (
    <div className="hidden sm:block">
      <nav
        aria-label="Tabs"
        className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
      >
        {tabs.map((tab, tabIdx) => (
          <button
            key={tab.name}
            onClick={() => {
              setCurrentTab(tab);
            }}
            aria-current={tab.current ? 'page' : undefined}
            className={classNames(
              tab.completed || tab.current || tab.inProgress
                ? 'cursor-pointer'
                : 'cursor-not-allowed',
              tab.current ? 'text-gray-900' : 'text-gray-500',
              tab.completed ? 'text-green-500' : '',
              tabIdx === 0 ? 'rounded-l-lg' : '',
              tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
              'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 text-center text-sm font-medium hover:bg-gray-50 hover:text-gray-700 focus:z-10',
            )}
          >
            <div className="align-center flex justify-center gap-2">
              {tab.completed ? (
                <CheckBadgeIcon className="h-5 w-5" color="green" />
              ) : null}
              <span>{tab.name}</span>
            </div>
            <span
              aria-hidden="true"
              className={classNames(
                tab.current ? 'bg-primary' : 'bg-transparent',
                'absolute inset-x-0 bottom-0 h-0.5',
              )}
            />
          </button>
        ))}
      </nav>
    </div>
  );
};

export const FormTabs = ({
  tabs,
  setCurrentTab,
}: {
  tabs: FormTab[];
  setCurrentTab: (tabs: FormTab) => void;
}) => {
  return (
    <div className="border-b border-gray-200">
      <MobileTabs tabs={tabs} setCurrentTab={setCurrentTab} />
      <DesktopTabs tabs={tabs} setCurrentTab={setCurrentTab} />
    </div>
  );
};
