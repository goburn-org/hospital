import { HTMLInputTypeAttribute } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import {
  FormMode,
  useFormMode,
} from '../../provider/form-context-provider/form-mode-provider';
import { LeadingAny } from '../leading-any-input';
import { CustomSelect, SelectOption } from '../select';
import { getNestedValue } from './form-util';

const getError = (error?: unknown) => {
  if (typeof error === 'string') {
    return error;
  }
  return error as string;
};
export const FormSelect = <T extends FieldValues = FieldValues>({
  labelName,
  options,
  id,
  isLoading,
  isRequired,
  multiple,
}: {
  labelName: string;
  isRequired?: boolean;
  id: Path<T>;
  type?: HTMLInputTypeAttribute;
  options?: SelectOption[];
  isLoading: boolean;
  multiple?: boolean;
}) => {
  const { setValue, formState, watch } = useFormContext<T>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  console.log(options);
  const error = formState.errors;
  return (
    <LeadingAny
      disabled={isReadOnly}
      label={labelName}
      error={getError(getNestedValue(error, id)?.message)}
    >
      <div className="block min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <CustomSelect
          disabled={isReadOnly}
          isRequired={isRequired}
          htmlFor=""
          labelName=""
          options={options}
          onChange={function (value): void {
            setValue(id, value as PathValue<T, Path<T>>);
          }}
          value={watch(id)}
          buttonClassName="py-3"
          isLoading={isLoading}
          multiple={multiple}
        />
      </div>
    </LeadingAny>
  );
};
