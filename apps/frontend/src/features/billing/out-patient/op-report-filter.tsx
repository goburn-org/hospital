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
import { useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { FaceList } from '../../../component/face-list';
import { TableLoading } from '../../../component/page-loader';
import { useOrderQuery } from '../../../provider/use-order';
import { classNames } from '../../../utils/classNames';
import { useParam } from '../../../utils/use-param';

const filters = [
  {
    id: 'status' as const,
    name: 'Status',
    options: [
      { value: '1', label: 'Not Started' },
      { value: '2', label: 'In Progress' },
      { value: '3', label: 'Completed' },
    ],
    type: 'checkbox',
  },
  {
    id: 'orderIds' as const,
    name: 'Orders',
    type: 'order',
  },
  {
    id: 'visitDate' as const,
    name: 'Visit Date',
    type: 'date',
  },
];

const getWeeks = () => {
  const today = new Date();

  // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
  const currentDayOfWeek = today.getDay();

  // Calculate the last Sunday
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - currentDayOfWeek);

  // Calculate the Sunday before last Sunday
  const sundayBeforeLast = new Date(lastSunday);
  sundayBeforeLast.setDate(lastSunday.getDate() - 7);

  // Optional: Reset time to midnight for consistency
  lastSunday.setHours(0, 0, 0, 0);
  sundayBeforeLast.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay(); // Current day of the week (0 for Sunday, 1 for Monday, etc.)

  // Calculate the days until next Sunday
  const daysUntilNextSunday = (7 - dayOfWeek) % 7;

  // Create a new date object for next Sunday
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilNextSunday);

  // Optional: Reset time to midnight for consistency
  nextSunday.setHours(0, 0, 0, 0);

  const daysUntilNextToNextSunday = 7 - dayOfWeek + 7;

  // Create a new date object for next to next Sunday
  const nextToNextSunday = new Date(today);
  nextToNextSunday.setDate(today.getDate() + daysUntilNextToNextSunday);

  // Optional: Reset time to midnight for consistency
  nextToNextSunday.setHours(0, 0, 0, 0);
  return {
    sundayBeforeLast,
    lastSunday,
    nextSunday,
    nextToNextSunday,
  };
};

const getMonths = () => {
  const today = new Date();

  // Function to get the first day of the month
  function getFirstDayOfMonth(date: Date) {
    return midNight(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  // Function to get the last day of the month
  function getLastDayOfMonth(date: Date) {
    return midNight(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  // This Month
  const thisMonthStart = getFirstDayOfMonth(today);
  const thisMonthEnd = getLastDayOfMonth(today);

  // Last Month
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthStart = getFirstDayOfMonth(lastMonth);
  const lastMonthEnd = getLastDayOfMonth(lastMonth);

  // Next Month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthStart = getFirstDayOfMonth(nextMonth);
  const nextMonthEnd = getLastDayOfMonth(nextMonth);

  return {
    lastMonthStart,
    lastMonthEnd,
    thisMonthStart,
    thisMonthEnd,
    nextMonthStart,
    nextMonthEnd,
  };
};

const midNight = (date: Date | number) => {
  return new Date(new Date(date).setHours(0, 0, 0, 0));
};

const nextNight = (date: Date | number) => {
  return new Date(new Date(date).setHours(23, 59, 59, 999));
};
const getFromTo = (id: string) => {
  const today = new Date();
  switch (id) {
    case 'Yesterday':
      return {
        from: midNight(new Date(today.setDate(new Date().getDate() - 1))),
        to: midNight(new Date().setDate(new Date().getDate()) - 1),
      };
    case 'Today':
      return {
        from: midNight(new Date()),
        to: nextNight(new Date()),
      };
    case 'Tomorrow':
      return {
        from: midNight(new Date(today.setDate(new Date().getDate() + 1))),
        to: nextNight(new Date(today.setDate(new Date().getDate() + 1))),
      };
    case 'Last Week':
      return {
        from: getWeeks().sundayBeforeLast,
        to: getWeeks().lastSunday,
      };
    case 'This Week':
      return {
        from: getWeeks().lastSunday,
        to: getWeeks().nextSunday,
      };
    case 'Next Week':
      return {
        from: getWeeks().nextSunday,
        to: getWeeks().nextToNextSunday,
      };
    case 'Last Month':
      return {
        from: getMonths().lastMonthStart,
        to: getMonths().lastMonthEnd,
      };
    case 'This Month':
      return {
        from: getMonths().thisMonthStart,
        to: getMonths().thisMonthEnd,
      };
    case 'Next Month':
      return {
        from: getMonths().nextMonthStart,
        to: getMonths().nextMonthEnd,
      };
    default:
      return null;
  }
};

const OrderFilter = ({
  selected,
  setSelected,
}: {
  selected: Maybe<string[]>;
  setSelected: (value: string[]) => void;
}) => {
  const [search, setSearch] = useState('');
  const { data, isFetching } = useOrderQuery();
  const ref = useRef<HTMLInputElement>(null);
  const order = search
    ? data?.filter((o) =>
        o.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    : data;
  return (
    <div className="h-[15rem] w-72 overflow-hidden">
      <input
        type="search"
        placeholder="Search order"
        className="mb-4 h-8 w-full rounded border border-gray-300 p-2"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setSearch('');
            ref.current?.focus();
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            if (order && order.length === 1) {
              setSelected([...(selected || []), order[0].id]);
              setSearch('');
              ref.current?.focus();
            }
          }
        }}
        ref={ref}
      />
      {isFetching ? <TableLoading /> : null}
      {order && order.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-1">
          <p className="text-base text-gray-500">No orders found</p>
          <button
            className="btn-text btn-small"
            type="button"
            onClick={() => {
              setSearch('');
              ref.current?.focus();
            }}
          >
            Clear Search
          </button>
        </div>
      )}
      {order && order.length > 0 ? (
        <List height={192} itemCount={order.length} itemSize={55} width={300}>
          {({ index, style }) => (
            <div
              key={order && order[index].id}
              className={classNames(
                order.length - 1 === index ? 'pb-4' : '',
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
                'ml-2 flex items-center gap-3 px-1',
              )}
              style={style}
            >
              <input
                id={`filter-orderId-${order[index].id}`}
                name={`orderId[]`}
                type="checkbox"
                checked={selected?.includes(order[index].id)}
                onChange={() => {
                  setSelected(
                    selected?.includes(order[index].id)
                      ? selected.filter((s) => s !== order[index].id)
                      : [...(selected || []), order[index].id],
                  );
                }}
                className="h-4 w-4 rounded border-gray-700 text-primary focus:ring-red-400"
              />
              <div className="flex flex-col gap-0">
                <label
                  htmlFor={`filter-orderId-${order[index].id}`}
                  className="whitespace-nowrap p-0 text-lg"
                >
                  <FaceList search={search} string={order[index].name} />
                </label>
              </div>
            </div>
          )}
        </List>
      ) : null}
    </div>
  );
};

const DateFilter = ({
  selected,
  setSelected,
}: {
  selected: { from: Date; to: Date; id: string };
  setSelected: (value: { from: Date; to: Date; id: string } | null) => void;
}) => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex w-full max-w-[720px] items-start justify-between rounded-md bg-gray-100 p-4 shadow-sm">
          <h6 className="whitespace-nowrap text-sm font-semibold text-gray-500">
            By Date
          </h6>
          <div className="flex items-center gap-4">
            {['Yesterday', 'Today'].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  const { from, to } = getFromTo(day) || {};
                  setSelected({ from: from!, to: to!, id: day });
                }}
                className={classNames(
                  'btn-text btn-text-secondary btn-small whitespace-nowrap',
                  selected.id === day ? '!text-primary' : '',
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full max-w-[720px] items-start justify-between rounded-md bg-gray-100 p-4 shadow-sm">
          <h6 className="whitespace-nowrap text-sm font-semibold text-gray-500">
            By Week
          </h6>
          <div className="flex items-center gap-4">
            {['Last Week', 'This Week'].map((week) => (
              <button
                key={week}
                type="button"
                onClick={() => {
                  const { from, to } = getFromTo(week) || {};
                  setSelected({ from: from!, to: to!, id: week });
                }}
                className={classNames(
                  'btn-text btn-text-secondary btn-small whitespace-nowrap',
                  selected.id === week ? '!text-primary' : '',
                )}
              >
                {week}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full max-w-[720px] items-start justify-between rounded-md bg-gray-100 p-4 shadow-sm">
          <h6 className="whitespace-nowrap text-sm font-semibold text-gray-500">
            By Month
          </h6>
          <div className="flex items-center gap-4">
            {['Last Month', 'This Month'].map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => {
                  const { from, to } = getFromTo(month) || {};
                  setSelected({ from: from!, to: to!, id: month });
                }}
                className={classNames(
                  'btn-text btn-text-secondary btn-small whitespace-nowrap',
                  selected.id === month ? '!text-primary' : '',
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProjectStatusFilter() {
  const { param, updateParam, removeParam, resetAll } = useParam<
    'status' | 'visitDate' | 'orderIds'
  >();
  const orderIds = JSON.parse(param.orderIds || '[]') as string[];
  const visitDate = JSON.parse(param.visitDate || '{}') as {
    from: Date;
    to: Date;
    id: string;
  };
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
                      section.id === 'orderIds' ? 'px-3 pt-4' : 'p-4',
                      'right-100 absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in',
                    )}
                  >
                    <form className="space-y-4">
                      {section.id in param ? (
                        <button
                          className="btn-text btn-small w-full justify-end"
                          type="reset"
                          onClick={(e) => {
                            e.preventDefault();
                            removeParam(section.id);
                          }}
                        >
                          Clear
                        </button>
                      ) : null}
                      {section.options?.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            defaultValue={option.value}
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            type="radio"
                            checked={
                              param[section.id] === option.value.toString()
                            }
                            onChange={() => {
                              updateParam(section.id, option.value.toString());
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-red-400"
                          />
                          <label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                      {section.type === 'date' ? (
                        <DateFilter
                          selected={visitDate}
                          setSelected={(value) => {
                            if (!value) {
                              removeParam(section.id);
                              return;
                            }
                            updateParam(section.id, JSON.stringify(value));
                          }}
                        />
                      ) : null}
                      {section.id === 'orderIds' ? (
                        <OrderFilter
                          selected={orderIds}
                          setSelected={(value) => {
                            updateParam('orderIds', JSON.stringify(value));
                          }}
                        />
                      ) : null}
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
              Clear filters
            </button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
