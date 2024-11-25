import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientVisitRequest,
  createPatientVisitSchema,
  ensure,
} from '@hospital/shared';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import { CustomSelect } from '../../component/select';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { routerConfig, TypingSpeed } from '../../utils/constants';
import { useDebounce } from '../../utils/use-debounce';
import { useEsc } from '../../utils/use-esc';
import { useEmployeeQuery } from '../employee/use-employee-query';
import { usePatientVisitMutation } from './use-patient-visit';

export const PatientVisitDrawer = ({
  defaultValues,
  departmentId,
}: {
  defaultValues?: CreatePatientVisitRequest;
  departmentId?: string;
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreatePatientVisitRequest>({
    resolver: zodResolver(createPatientVisitSchema),
    defaultValues,
  });
  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  return (
    <div className="w-[800px]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-semibold capitalize text-gray-400">
          New Patient Visit
        </h1>
        <button
          type="button"
          aria-label="Close panel"
          className="btn-text btn-text-secondary"
          onClick={() => {
            navigate('../', {
              replace: true,
            });
          }}
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
      </div>
      <FormModeProvider mode={FormMode.Editable} oldId={departmentId}>
        <FormProvider {...formProvider}>
          <form className="flex flex-col gap-12">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-5">
                <DoctorSelect />
              </div>
              <div className="sm:col-span-5">
                <FormInput<CreatePatientVisitRequest>
                  isRequired
                  id="checkInTime"
                  labelName="Check In Time"
                  autoComplete="off"
                  type="datetime-local"
                  defaultValue={new Date()}
                />
              </div>
            </div>
            <CreateFooter />
          </form>
        </FormProvider>
      </FormModeProvider>
    </div>
  );
};

const DoctorSelect = () => {
  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, TypingSpeed);
  const { data } = useEmployeeQuery({
    search: searchDebounce,
    paginate: {
      limit: 10,
      page: 1,
    },
  });
  const res =
    data?.data.map((item) => ({
      label: item.name,
      id: item.id,
    })) ?? [];
  const { watch, setValue } = useFormContext<CreatePatientVisitRequest>();
  return (
    <CustomSelect
      options={res}
      value={watch('doctorId')}
      onRawChange={(value) => {
        setSearch(value);
      }}
      labelName="Doctor Name"
      htmlFor="doctorId"
      onChange={(value) => {
        setValue('doctorId', value, {
          shouldValidate: true,
          shouldTouch: true,
          shouldDirty: true,
        });
      }}
    />
  );
};

const CreateFooter = () => {
  const formProvider = useFormContext<CreatePatientVisitRequest>();
  const { patientId } = useParams();
  ensure(patientId, 'Patient id is required');
  const { mutateAsync } = usePatientVisitMutation({
    onError: (err) => {
      if (err instanceof Error) {
        formProvider.setError('doctorId', {
          message: err.message,
        });
      }
      formProvider.setError('doctorId', {
        message: String(err),
      });
    },
    onSuccess: (data) => {
      navigate(
        `${routerConfig.Patient}/${data.uhid}/${routerConfig.Visit}/${data.id}`,
        {
          replace: true,
        },
      );
    },
  });
  const navigate = useNavigate();
  return (
    <div className="flex mt-24 w-[95%] items-center justify-end gap-x-6">
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          window.history.back();
        }}
      >
        Cancel
      </button>
      <button
        type={'button'}
        className={classNames(
          'btn-primary capitalize',
          formProvider.formState.isSubmitting
            ? 'cursor-not-allowed bg-red-400'
            : 'cursor-pointer',
        )}
        disabled={formProvider.formState.isSubmitting}
        onClick={async () => {
          console.log(formProvider.getValues());
          await formProvider.handleSubmit((data) => {
            return mutateAsync({ ...data, patientId });
          })();
        }}
      >
        {formProvider.formState.isSubmitting ? (
          <svg
            className="mr-3 h-5 w-5 animate-spin text-white"
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
        ) : null}
        Create
      </button>
    </div>
  );
};
