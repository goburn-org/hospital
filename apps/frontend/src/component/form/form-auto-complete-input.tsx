import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import {
  FormMode,
  useFormMode,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { FaceList } from '../face-list';
import { getNestedValue } from './form-util';

export const FormAutoCompleteInput = <T extends FieldValues = FieldValues>({
  labelName,
  placeholder,
  id,
  isRequired,
  disabled,
  twoColumn,
  inputClassName,
  defaultValue,
  options,
  onEnter,
}: {
  labelName: string;
  placeholder?: string;
  id: Path<T>;
  isRequired?: boolean;
  disabled?: boolean;
  twoColumn?: boolean;
  inputClassName?: string;
  defaultValue?: PathValue<T, Path<T>>;
  options?: { label: string; id: string | number }[];
  onEnter?: (id: string | number) => void;
}) => {
  const { setValue, formState, control } = useFormContext<T>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  const defaultSet = useRef(false);
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(0);

  const optionsLength = options?.length || 0;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentSelected((prev) => {
          if (prev + 1 < optionsLength) {
            return prev + 1;
          }
          return prev;
        });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentSelected((prev) => {
          if (prev - 1 >= 0) {
            return prev - 1;
          }
          return prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [optionsLength]);

  useEffect(() => {
    if (defaultValue) {
      if (defaultSet.current) {
        return;
      }
      defaultSet.current = true;
      setValue(id, defaultValue as any);
    }
  }, [defaultValue, id, setValue]);

  return (
    <div
      className={classNames(
        twoColumn
          ? 'sm:grid sm:grid-cols-7 sm:items-start sm:gap-4 '
          : 'sm:col-span-4',
      )}
    >
      <label
        htmlFor={id}
        className={classNames(
          twoColumn ? 'block sm:pt-1.5' : 'block leading-6 ',
          'font-medium text-gray-900 text-base',
        )}
      >
        {labelName} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div
        className={classNames(twoColumn ? 'mt-2 sm:col-span-2 sm:mt-0' : '')}
      >
        <Controller
          name={id}
          control={control}
          render={({ formState, field }) => {
            return (
              <div className="relative flex flex-col gap-2 ">
                <input
                  id={id}
                  disabled={isReadOnly || disabled}
                  autoComplete="off"
                  className={classNames(
                    inputClassName
                      ? inputClassName
                      : twoColumn
                        ? 'sm:max-w-xs'
                        : '',
                    getNestedValue(formState.errors, id)
                      ? 'border-red-500'
                      : 'border-gray-300',
                    twoColumn
                      ? 'block w-full py-1.5  sm:text-sm/6 '
                      : 'w-full  p-2 ',
                    'rounded-md border disabled:bg-gray-100 bg-white',
                  )}
                  placeholder={placeholder}
                  value={field.value || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowOptions(false);
                    }
                    if (e.key === 'Enter' && options?.length && showOptions) {
                      e.preventDefault();
                      setValue(
                        id,
                        options[currentSelected].label as PathValue<T, Path<T>>,
                        {
                          shouldValidate: true,
                          shouldTouch: true,
                        },
                      );
                      setShowOptions(false);
                      onEnter && onEnter(options[currentSelected].id);
                    }
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowOptions(true);
                    setValue(id, e.target.value as PathValue<T, Path<T>>, {
                      shouldValidate: true,
                      shouldTouch: true,
                    });
                  }}
                />
                <div>
                  {search && options && showOptions ? (
                    <div className="absolute bg-white border border-gray-300 rounded-md w-full shadow-md">
                      {options?.map((option, idx) => (
                        <button
                          key={option.id}
                          className={classNames(
                            currentSelected === idx
                              ? 'bg-indigo-200 shadow-sm'
                              : '',
                            'p-2 cursor-pointer hover:bg-gray-100 w-full text-left',
                          )}
                          onClick={() => {
                            setValue(
                              id,
                              options[currentSelected].label as PathValue<
                                T,
                                Path<T>
                              >,
                              {
                                shouldValidate: true,
                                shouldTouch: true,
                              },
                            );
                            showOptions && setShowOptions(false);
                          }}
                        >
                          <FaceList string={option.label} search={search} />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          }}
        />
        {getNestedValue(formState.errors, id) && (
          <p className="text-base text-red-500">
            {getNestedValue(formState.errors, id)?.message as unknown as string}
          </p>
        )}
      </div>
    </div>
  );
};
