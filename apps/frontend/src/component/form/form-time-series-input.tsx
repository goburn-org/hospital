import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { humanizedDate, Maybe } from '@hospital/shared';
import { TimeSeriesType } from 'libs/shared/src/lib/time-series-util';
import { HTMLInputTypeAttribute, useRef, useState } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import { classNames } from '../../utils/classNames';
import Tooltip from '../tooltip';
import { getNestedValue } from './form-util';

export const FormTimeSeriesInput = <T extends FieldValues = FieldValues>({
  id,
  labelName,
  isRequired,
  type,
  isReadOnly,
  disabled,
  placeholder,
  defaultValue,
}: {
  id: Path<T>;
  labelName: string;
  isRequired?: boolean;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  isReadOnly?: boolean;
  placeholder: string;
  defaultValue?: HTMLInputTypeAttribute;
}) => {
  const { setValue, formState, watch, getValues } = useFormContext<T>();
  const [editId, setEditId] = useState<TimeSeriesType[number]['id']>();
  const nextId = (watch(id)?.length || 0) + 1;
  const editValue = (watch(id) as TimeSeriesType)?.find((v) => v.id === editId);
  const ref = useRef<HTMLInputElement>(null);

  const getUpdatedValue = (reading: any): TimeSeriesType => {
    const old = getValues(id) as Maybe<TimeSeriesType>;
    if (!old) {
      return [
        {
          id: nextId,
          reading,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }
    if (editId === undefined) {
      return [
        ...old,
        {
          id: nextId,
          reading,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }
    return old.map((v) => {
      if (v.id === editId) {
        return {
          ...v,
          reading,
          updatedAt: new Date(),
        };
      }
      return v;
    });
  };
  const data = [...watch(id)]?.reverse();

  return (
    <div className={'sm:col-span-4'}>
      <label htmlFor={id} className="font-medium text-gray-900 text-base">
        {labelName} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div>
        <div className="flex gap-2">
          <input
            id={id}
            type={type}
            disabled={isReadOnly || disabled}
            autoComplete="off"
            ref={ref}
            className={classNames(
              'w-full p-2',
              'rounded-md border disabled:bg-gray-100 bg-white',
            )}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') {
                return;
              }
              console.log('enter');
              e.preventDefault();
              setEditId(undefined);
              const value = ref.current?.value;
              if (ref.current) {
                ref.current.value = '';
              }
              ref.current?.focus();
              if (value === '' || value == null) {
                const updatedValue = getUpdatedValue(undefined);
                setValue(id, updatedValue as PathValue<T, Path<T>>, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
                return;
              }
              if (type === 'number') {
                const updatedValue = getUpdatedValue(Number(value));
                setValue(id, updatedValue as PathValue<T, Path<T>>, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
                return;
              }
              if (type === 'date' || type === 'datetime-local') {
                const updatedValue = getUpdatedValue(new Date(value!));
                setValue(id, updatedValue as PathValue<T, Path<T>>, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
                return;
              }
              const updatedValue = getUpdatedValue(value);
              setValue(id, updatedValue as PathValue<T, Path<T>>, {
                shouldValidate: true,
                shouldTouch: true,
              });
            }}
          />
          <div className="flex gap-1">
            <button
              type="button"
              className={classNames(
                editId ? 'btn-primary' : 'btn-text',
                'text-nowrap',
              )}
              onClick={() => {
                setEditId(undefined);
                setValue(
                  id,
                  getUpdatedValue(undefined) as PathValue<T, Path<T>>,
                  {
                    shouldValidate: true,
                    shouldTouch: true,
                  },
                );
              }}
            >
              {editId === undefined ? `Add ${nextId}` : `Edit ${editValue?.id}`}
            </button>
            {editId !== undefined && (
              <button
                type="button"
                className="btn-text"
                onClick={() => {
                  setEditId(undefined);
                  const values = (getValues(id) as TimeSeriesType) || [];
                  setValue(
                    id,
                    values.filter((v) => v.id !== editId) as PathValue<
                      T,
                      Path<T>
                    >,
                    {
                      shouldValidate: true,
                      shouldTouch: true,
                    },
                  );
                }}
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </button>
            )}
          </div>
        </div>
        <p className="text-base text-red-500">
          {getNestedValue(formState.errors, id)?.message as unknown as string}
        </p>
        <div className="w-full overflow-auto flex flex-col gap-1 py-2 pb-4">
          <div className="flex gap-2">
            {data.map((v: TimeSeriesType[number]) => (
              <div key={v.id} className="flex gap-2  bg-slate-200 p-2">
                <div className="flex flex-col gap-1 ">
                  <p className="">{v.reading}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap text-nowrap">
                    {humanizedDate(v.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => {
                    setEditId(v.id);
                    if (ref.current) {
                      ref.current.value = v.reading.toString();
                      ref.current.focus();
                    }
                  }}
                >
                  <PencilIcon className="h-5 w-5 text-blue-500" />
                </button>
              </div>
            ))}
          </div>
          {nextId > 2 ? (
            <Tooltip
              bgColor="bg-black"
              text={
                <div className="flex flex-col gap-1 bg-black w-full p-4">
                  <p className="text-lg text-white">All Readings</p>
                  {data.map((v: TimeSeriesType[number]) => (
                    <div
                      key={v.id}
                      className="flex gap-2 items-center justify-between "
                    >
                      <p className="text-lg text-white">{v.reading}</p>
                      <p className="text-xs text-gray-400 whitespace-nowrap text-nowrap">
                        {humanizedDate(v.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              }
            >
              <button type="button" className="text-blue-700">
                Show All
              </button>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
};
