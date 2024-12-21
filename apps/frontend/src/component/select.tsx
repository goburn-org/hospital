import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ReactNode, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { classNames } from '../utils/classNames';
import Tooltip from './tooltip';

export type SelectOption = {
  id: string | number;
  label: string;
  sub?: string;
  icon?: ReactNode;
};

type Props<Option extends SelectOption> = {
  labelName: string;
  htmlFor: string;
  options?: Option[];
  isLoading?: boolean;
  onChange: Props<Option>['multiple'] extends true
    ? (value: Option['id'][]) => void
    : (value: Option['id']) => void;
  value?: Props<Option>['multiple'] extends true
    ? (string | number)[] | null
    : string | number | null;
  defaultValue?: string;
  disabled?: boolean;
  buttonClassName?: string;
  isRequired?: boolean;
  multiple?: boolean;
  error?: string;
  onRawChange?: (value: string) => void;
  clearButton?: boolean;
  disableSearch?: boolean;
};

export const CustomSelect = <Option extends SelectOption>({
  labelName,
  htmlFor,
  options,
  value,
  onChange,
  disabled,
  buttonClassName,
  isLoading,
  isRequired,
  multiple,
  error,
  onRawChange,
  clearButton,
  disableSearch,
}: Props<Option>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const selection = Array.isArray(value) ? value : [value];
  const initialValue = multiple
    ? ([] as (string | number)[])
    : ('' as string | number);

  return (
    <Listbox
      as="div"
      value={value || initialValue}
      onChange={(e) => {
        onChange(e as any);
      }}
      multiple={multiple}
    >
      <div className="flex justify-between">
        {labelName ? (
          <Label
            as="label"
            htmlFor={htmlFor}
            className="block text-base font-medium leading-6 text-gray-900"
          >
            {labelName}{' '}
            {isRequired ? <span className="text-red-500">*</span> : ''}
          </Label>
        ) : null}
        {clearButton && initialValue !== value && value ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              onChange(initialValue as any);
            }}
            className="!text-red-600 btn-text btn-small"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="relative">
        <ListboxButton
          disabled={disabled}
          type="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.click();
            }
          }}
          className={classNames(
            buttonClassName,
            'relative w-full min-w-[150px] cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 sm:text-sm sm:leading-6',
          )}
        >
          <span className="inline-flex w-full truncate">
            <span className="truncate">
              {selection
                .map((v) => options?.find((o) => o.id === v)?.label)
                .join(', ')}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 w-full overflow-x-hidden min-w-[150px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {/* Search Input */}
          {disableSearch ? null : (
            <div className="sticky top-0 z-10 bg-white p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  onRawChange?.(e.target.value);
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.stopPropagation(); // Stop the space key from propagating
                  }
                }}
                className="w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search..."
              />
            </div>
          )}
          {isLoading ? (
            <ListboxOption
              value=""
              className="group relative cursor-default select-none py-2 pl-3 pr-4 text-gray-900"
            >
              <div className="flex flex-row items-center gap-2">
                <span className="h-8 w-8">
                  <svg
                    className="animate-spin h-5 w-5 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V2.5"
                    />
                  </svg>
                </span>
                <p className="font-normal">Loading...</p>
              </div>
            </ListboxOption>
          ) : filteredOptions?.length ? (
            <List
              height={192}
              itemCount={filteredOptions.length}
              itemSize={35}
              width="100%"
            >
              {({ index, style }) => (
                <ListboxOption
                  key={filteredOptions[index].id}
                  value={filteredOptions[index].id}
                  className={classNames(
                    selection.includes(filteredOptions[index].id)
                      ? 'bg-gray-100'
                      : '',
                    'group relative cursor-default select-none py-2 pl-3 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white',
                  )}
                  style={style}
                >
                  <div className="flex flex-row items-center gap-2">
                    {filteredOptions[index].icon ? (
                      <span className="w-4" id="icon">
                        {filteredOptions[index].icon}
                      </span>
                    ) : null}
                    <div className="flex w-full flex-col">
                      <div className="flex w-full justify-between">
                        <p className="font-normal group-data-[selected]:font-semibold text-nowrap whitespace-nowrap overflow-hidden text-ellipsis">
                          <Tooltip text={filteredOptions[index].label}>
                            {filteredOptions[index].label}
                          </Tooltip>
                        </p>
                        <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                          <CheckIcon aria-hidden="true" className="h-5 w-5" />
                        </span>
                      </div>
                      {filteredOptions[index].sub ? (
                        <p className="mt-2 text-gray-500 group-data-[focus]:text-indigo-200">
                          {filteredOptions[index].sub}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </ListboxOption>
              )}
            </List>
          ) : (
            <div className="p-2 text-center text-sm text-gray-500">
              No results found
            </div>
          )}
        </ListboxOptions>
      </div>
      <div>
        {error ? <p className="text-base text-red-500">{error}</p> : null}
      </div>
    </Listbox>
  );
};
