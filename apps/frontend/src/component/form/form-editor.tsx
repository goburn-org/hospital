import { useEffect, useRef } from 'react';
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
import { CustomEditor } from '../editor';
import { getNestedValue } from './form-util';

export const FormEditor = <T extends FieldValues = FieldValues>({
  labelName,
  placeholder,
  id,
  isRequired,
  disabled,
  twoColumn,
  inputClassName,
  defaultValue,
}: {
  labelName: string;
  placeholder?: string;
  id: Path<T>;
  isRequired?: boolean;
  disabled?: boolean;
  twoColumn?: boolean;
  inputClassName?: string;
  defaultValue?: PathValue<T, Path<T>>;
}) => {
  const { setValue, formState, control } = useFormContext<T>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  const defaultSet = useRef(false);
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
        className={classNames(twoColumn ? 'mt-2 sm:col-span-4 sm:mt-0' : '')}
      >
        <Controller
          name={id}
          control={control}
          render={({ formState, field }) => {
            return (
              <CustomEditor
                disabled={isReadOnly || disabled}
                className={classNames(
                  inputClassName ? inputClassName : twoColumn ? 'w-full' : '',
                  getNestedValue(formState.errors, id)
                    ? 'border-red-500'
                    : 'border-gray-300',
                  twoColumn ? 'block sm:text-sm/6 ' : 'p-1 ',
                  'rounded-md border disabled:bg-gray-100 bg-white',
                )}
                placeholder={placeholder}
                initialValue={field.value || ''}
                onChange={(e) => {
                  setValue(id, e as PathValue<T, Path<T>>, {
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                }}
              />
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
