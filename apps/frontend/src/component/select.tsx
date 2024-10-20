import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ReactNode } from 'react';
import { classNames } from '../utils/classNames';

export type SelectOption = {
  id: string | number;
  label: string;
  sub?: string;
  icon?: ReactNode;
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
}: {
  labelName: string;
  htmlFor: string;
  options?: Option[];
  isLoading?: boolean;
  onChange: (value: string) => void;
  value: string;
  defaultValue?: string;
  disabled?: boolean;
  buttonClassName?: string;
  isRequired?: boolean;
}) => {
  return (
    <Listbox
      as="div"
      value={value ?? ''}
      onChange={(e) => {
        onChange(e);
      }}
    >
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
              {options?.find((o) => o.id === value)?.label}
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
          className="absolute z-10 mt-1 max-h-60 w-full min-w-[150px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {isLoading ? (
            <ListboxOption
              value=""
              className="group relative cursor-default select-none py-2 pl-3 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
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
                <div className="flex w-full flex-col">
                  <div className="flex w-full justify-between">
                    <p className="font-normal group-data-[selected]:font-semibold">
                      Loading...
                    </p>
                  </div>
                </div>
              </div>
            </ListboxOption>
          ) : null}
          {options?.map((option) => (
            <ListboxOption
              key={option.id}
              value={option.id}
              className={classNames(
                option.id === value ? 'bg-gray-100' : '',
                'group relative cursor-default select-none py-2 pl-3 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white',
              )}
            >
              <div className="flex flex-row items-center gap-2">
                {option.icon ? (
                  <span className="h-8 w-8">{option.icon}</span>
                ) : null}
                <div className="flex w-full flex-col">
                  <div className="flex w-full justify-between">
                    <p className="font-normal group-data-[selected]:font-semibold">
                      {option.label}
                    </p>
                    <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                      <CheckIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  {option.sub ? (
                    <p className="mt-2 text-gray-500 group-data-[focus]:text-indigo-200">
                      {option.sub}
                    </p>
                  ) : null}
                </div>
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
