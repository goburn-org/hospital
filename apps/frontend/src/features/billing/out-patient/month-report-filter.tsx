'use client';

import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Maybe } from '@hospital/shared';
import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames';
import { useParam } from '../../../utils/use-param';

const filters = [
  {
    id: 'visitDate' as const,
    name: 'Visit Date',
    type: 'date',
  },
];

const MonthFilter = ({
  selected,
  setSelected,
}: {
  selected: Maybe<{ from: Date; to: Date; id: string }>;
  setSelected: (value: { from: Date; to: Date; id: string } | null) => void;
}) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleNavigation = (direction: number) => {
    const date = selected?.from ? selected.from : new Date();
    const currentFrom = new Date(date);
    const newFrom = new Date(
      currentFrom.getFullYear(),
      currentFrom.getMonth() + direction,
      1,
    );
    const newTo = new Date(
      newFrom.getFullYear(),
      newFrom.getMonth() + 1,
      0, // Last day of the new month
    );
    console.log({
      newFrom,
      newTo,
      id: `${monthNames[newFrom.getMonth()]} ${newFrom.getFullYear()}`,
    });
    setSelected({
      from: newFrom,
      to: newTo,
      id: `${monthNames[newFrom.getMonth()]} ${newFrom.getFullYear()}`,
    });
  };

  return (
    <div className="flex w-full max-w-[720px] flex-col gap-4 rounded-md bg-gray-100 p-4 shadow-sm">
      <h6 className="whitespace-nowrap text-sm font-semibold text-gray-500">
        Select Month & Year
      </h6>
      <div className="flex items-center justify-between gap-4">
        {/* Navigation to Previous Month */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(-1);
          }}
          className="btn-text btn-text-secondary btn-small"
        >
          ←
        </button>

        {/* Display Current Month-Year */}
        <span className="text-base font-medium text-gray-800 whitespace-nowrap">
          {selected?.from
            ? `${monthNames[new Date(selected.from).getMonth()]} ${new Date(selected.from).getFullYear()}`
            : ''}
        </span>

        {/* Navigation to Next Month */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(1);
          }}
          className="btn-text btn-text-secondary btn-small"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default function MonthlyReportFilter() {
  const { param, updateParam, removeParam, resetAll } = useParam<'visitDate'>();
  const visitDate = JSON.parse(param.visitDate || '{}') as {
    from: Date;
    to: Date;
    id: string;
  };
  useEffect(() => {
    if (!visitDate.from) {
      const date = new Date();
      const newFrom = new Date(date.getFullYear(), date.getMonth(), 1);
      const newTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      updateParam(
        'visitDate',
        JSON.stringify({
          from: newFrom,
          to: newTo,
          id: `${date.getMonth()} ${date.getFullYear()}`,
        }),
      );
    }
  }, [updateParam, visitDate]);
  return (
    <div className="bg-gray-50">
      <div className="mx-auto px-3 text-center sm:px-3 lg:px-4">
        <section
          aria-labelledby="filter-heading"
          className="flex items-center gap-4 border-t border-gray-200 py-6"
        >
          <h2 id="filter-heading" className="sr-only">
            Project status filters
          </h2>
          <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-400" />

          <div className="flex items-center justify-between">
            <PopoverGroup className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {filters.map((section, sectionIdx) => (
                <Popover
                  key={section.name}
                  id={`desktop-menu-${sectionIdx}`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <PopoverButton className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{section.name}</span>
                      {section.id in param ? (
                        <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                          1
                        </span>
                      ) : null}
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      />
                    </PopoverButton>
                  </div>

                  <PopoverPanel
                    transition
                    className={classNames(
                      'p-4',
                      'right-100 absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in',
                    )}
                  >
                    <form className="space-y-4">
                      <MonthFilter
                        selected={visitDate}
                        setSelected={(value) => {
                          if (!value) {
                            removeParam(section.id);
                            return;
                          }
                          updateParam(section.id, JSON.stringify(value));
                        }}
                      />
                    </form>
                  </PopoverPanel>
                </Popover>
              ))}
            </PopoverGroup>
          </div>
          {Object.values(param).length ? (
            <button
              className="btn-text btn-small"
              onClick={(e) => {
                e.preventDefault();
                resetAll();
              }}
            >
              <span className="sr-only">Clear filters</span>
              This Month
            </button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
