import moment from 'moment';
import {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  useEffect,
  useRef,
} from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import {
  FormMode,
  useFormMode,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { getNestedValue } from './form-util';

const parseValue = (value: string, type: HTMLInputTypeAttribute) => {
  if (type === 'number' && typeof value === 'number') {
    return Number(value);
  }
  if (type === 'date' && value) {
    return moment(value).format('YYYY-MM-DD');
  }
  if (type === 'datetime-local' && value) {
    return moment(value).format('YYYY-MM-DDTHH:mm');
  }
  if (value === undefined) {
    return '';
  }
  return value;
};

export const FormInput = <T extends FieldValues = FieldValues>({
  labelName,
  placeholder,
  id,
  autoComplete,
  type,
  isRequired,
  disabled,
  twoColumn,
  inputClassName,
  defaultValue,
  allowZero,
}: {
  labelName: string;
  placeholder?: string;
  id: Path<T>;
  autoComplete: HTMLInputAutoCompleteAttribute;
  type?: HTMLInputTypeAttribute;
  isRequired?: boolean;
  disabled?: boolean;
  twoColumn?: boolean;
  inputClassName?: string;
  defaultValue?: PathValue<T, Path<T>>;
  allowZero?: boolean;
}) => {
  const { setValue, formState, watch } = useFormContext<T>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  const defaultSet = useRef(false);
  const value = parseValue(watch(id), type ?? 'text');
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
        <input
          id={id}
          type={type}
          disabled={isReadOnly || disabled}
          autoComplete={autoComplete}
          className={classNames(
            inputClassName ? inputClassName : twoColumn ? 'sm:max-w-xs' : '',
            getNestedValue(formState.errors, id)
              ? 'border-red-500'
              : 'border-gray-300',
            twoColumn ? 'block w-full py-1.5  sm:text-sm/6 ' : 'w-full  p-2 ',
            'rounded-md border disabled:bg-gray-100 bg-white',
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (e.target.value === '') {
              setValue(id, undefined as any, {
                shouldValidate: true,
                shouldTouch: true,
              });
              return;
            }

            if (type === 'number') {
              setValue(id, Number(e.target.value) as PathValue<T, Path<T>>, {
                shouldValidate: true,
                shouldTouch: true,
              });
              return;
            }
            if (type === 'date' || type === 'datetime-local') {
              setValue(id, new Date(e.target.value) as PathValue<T, Path<T>>, {
                shouldValidate: true,
                shouldTouch: true,
              });
              return;
            }
            setValue(id, e.target.value as PathValue<T, Path<T>>, {
              shouldValidate: true,
              shouldTouch: true,
            });
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
