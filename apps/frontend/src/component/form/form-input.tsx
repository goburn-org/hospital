import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from 'react';
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { classNames } from '../../utils/classNames';
import { getNestedValue } from './form-util';
import {
  FormMode,
  useFormMode,
} from '../../provider/form-context-provider/form-mode-provider';

export const FormInput = <T extends FieldValues = FieldValues>({
  labelName,
  placeholder,
  id,
  autoComplete,
  type,
  isRequired,
  disabled,
}: {
  labelName: string;
  placeholder: string;
  id: Path<T>;
  autoComplete: HTMLInputAutoCompleteAttribute;
  type?: HTMLInputTypeAttribute;
  isRequired?: boolean;
  disabled?: boolean;
}) => {
  const { setValue, formState, control } = useFormContext<T>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  return (
    <div className="sm:col-span-4">
      <label
        htmlFor={id}
        className="block text-base font-medium leading-6 text-gray-900"
      >
        {labelName} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div>
        <Controller
          name={id}
          control={control}
          render={({ formState, field }) => (
            <input
              id={id}
              type={type}
              disabled={isReadOnly || disabled}
              autoComplete={autoComplete}
              className={classNames(
                getNestedValue(formState.errors, id)
                  ? 'border-red-500'
                  : 'border-gray-300',
                'w-full rounded-md border p-2 disabled:bg-gray-100',
              )}
              placeholder={placeholder}
              value={field.value ?? ''}
              onChange={(e) => {
                const value =
                  type === 'number' ? Number(e.target.value) : e.target.value;
                setValue(id, value as PathValue<T, Path<T>>, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
            />
          )}
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
