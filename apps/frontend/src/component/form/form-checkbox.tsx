import { useEffect, useRef } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import {
  FormMode,
  useFormMode,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { getNestedValue } from './form-util';

export const FormCheckbox = <T extends FieldValues = FieldValues>({
  labelName,
  placeholder,
  id,
  isRequired,
  disabled,
  twoColumn,
  defaultValue,
}: {
  labelName: string;
  placeholder?: string;
  id: Path<T>;
  isRequired?: boolean;
  disabled?: boolean;
  twoColumn?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
}) => {
  const { setValue, formState, watch } = useFormContext<T>();
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
    <div className="flex flex-col h-full align-middle justify-center">
      <div className={classNames('sm:col-span-4 flex gap-2 justify-center')}>
        <div>
          <input
            id={id}
            type={'checkbox'}
            disabled={isReadOnly || disabled}
            className={classNames(
              getNestedValue(formState.errors, id)
                ? '!border-red-500 !bg-blue-50'
                : '!border-blue-600 !bg-blue-300',
              'rounded-md border disabled:bg-gray-100 !bg-blue-300',
            )}
            placeholder={placeholder}
            checked={watch(id) || false}
            onChange={(e) => {
              setValue(id, e.target.checked as PathValue<T, Path<T>>, {
                shouldValidate: true,
                shouldTouch: true,
              });
            }}
          />
        </div>
        <label
          htmlFor={id}
          className={classNames('font-medium text-gray-900 text-base')}
        >
          {labelName} {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      {getNestedValue(formState.errors, id) && (
        <p className="text-base text-red-500">
          {getNestedValue(formState.errors, id)?.message as unknown as string}
        </p>
      )}
    </div>
  );
};
