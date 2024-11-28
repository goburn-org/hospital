import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePatientInput, createPatientSchema } from '@hospital/shared';
import { Divider } from '@mui/material';
import { useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import { CustomSelect } from '../../component/select';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { useEsc } from '../../utils/use-esc';
import {
  useCreatePatientMutation,
  useUpdatePatientMutation,
} from './use-patient-query';

export const PatientDrawer = ({
  defaultValues,
  mode,
  patientId,
}: {
  defaultValues?: CreatePatientInput;
  mode: 'create' | 'edit' | 'view';
  patientId?: string;
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues,
  });
  const dob = formProvider.watch('dob');
  useEffect(() => {
    if (dob) {
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      console.log(age);
      formProvider.setValue('age', age, {
        shouldValidate: true,
      });
    }
  }, [dob, formProvider]);
  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  const editable = mode !== 'view';
  return (
    <div className="w-[800px]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-semibold capitalize text-gray-400">
          {mode} Patient
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
      <FormModeProvider
        mode={editable ? FormMode.Editable : FormMode.ReadOnly}
        oldId={patientId}
      >
        <FormProvider {...formProvider}>
          <form className="flex max-h-[90vh] flex-col gap-12">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  isRequired
                  autoComplete="off"
                  id="name"
                  labelName="Patient Name"
                  placeholder=" John Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  isRequired
                  id="age"
                  labelName="Age"
                  placeholder="1996"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  isRequired
                  id="mobile"
                  labelName="Mobile"
                  placeholder=" 9876543210"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-2">
                <CustomSelect
                  isRequired
                  labelName="Gender"
                  htmlFor="Gender"
                  onChange={(e) => {
                    formProvider.setValue('gender', e, {
                      shouldValidate: true,
                    });
                  }}
                  value={formProvider.watch('gender')}
                  error={formProvider.formState.errors.gender?.message}
                  options={[
                    {
                      id: 'MALE' as const,
                      label: 'Male',
                    },
                    {
                      id: 'FEMALE' as const,
                      label: 'Female',
                    },
                    {
                      id: 'OTHER' as const,
                      label: 'Other',
                    },
                  ]}
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  isRequired
                  id="fatherName"
                  labelName="Father's Name"
                  placeholder=" Dad's Name"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-6">
                <Divider />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  id="dob"
                  labelName="Date Of Birth"
                  placeholder=" Tablet"
                  autoComplete="off"
                  type="date"
                />
              </div>
              <div className="sm:col-span-2">
                <CustomSelect
                  labelName="Blood Group"
                  htmlFor="bloodGroup"
                  onChange={(e) => {
                    formProvider.setValue('bloodGroup', e, {
                      shouldValidate: true,
                    });
                  }}
                  value={formProvider.watch('bloodGroup')}
                  error={formProvider.formState.errors.bloodGroup?.message}
                  options={(
                    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
                  ).map((e) => ({ id: e, label: e }))}
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreatePatientInput>
                  id="aadharNumber"
                  labelName="Aadhar Number"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreatePatientInput>
                  id="aadharName"
                  labelName="Aadhar Name"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-6">
                <FormInput<CreatePatientInput>
                  id="address"
                  labelName="Address"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  id="city"
                  labelName="City"
                  autoComplete="address-level2"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreatePatientInput>
                  id="pincode"
                  labelName="Pincode"
                  placeholder=" 605 602"
                  autoComplete="address-level3"
                />
              </div>
            </div>
            {mode === 'view' ? <ViewFooter /> : null}
            {mode === 'create' ? <CreateFooter /> : null}
            {mode === 'edit' ? <EditFooter /> : null}
          </form>
        </FormProvider>
      </FormModeProvider>
    </div>
  );
};

const ViewFooter = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="flex w-[95%] items-center justify-end gap-x-6">
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          const path = `../../${routerConfig.Patient}/${routerConfig.Edit}/${id}`;
          navigate(path, {
            replace: true,
          });
        }}
      >
        Edit
      </button>
      <button
        type="button"
        className={classNames('btn-primary')}
        onClick={() => {
          navigate('../', {
            replace: true,
          });
        }}
      >
        Close
      </button>
    </div>
  );
};

const CreateFooter = () => {
  const formProvider = useFormContext<CreatePatientInput>();
  const { mutateAsync } = useCreatePatientMutation({
    onError: (err) => {
      if (err instanceof Error) {
        formProvider.setError('name', {
          message: err.message,
        });
      }
      formProvider.setError('name', {
        message: String(err),
      });
    },
    onSuccess: () => {
      navigate('..', {
        replace: true,
      });
    },
  });
  const navigate = useNavigate();
  return (
    <div className="flex w-[95%] items-center justify-end gap-x-6">
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          navigate('../', {
            replace: true,
          });
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
            return mutateAsync(data);
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

const EditFooter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formProvider = useFormContext<CreatePatientInput>();
  const { mutateAsync } = useUpdatePatientMutation({
    onSuccess: () => {
      navigate('..', {
        replace: true,
      });
    },
  });
  return (
    <div className="flex w-[95%] items-center justify-end gap-x-6">
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          navigate('../', {
            replace: true,
          });
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
          if (!id) {
            return;
          }
          console.log(formProvider.getValues());
          await formProvider.handleSubmit((data) => {
            console.log(data);
            return mutateAsync({
              ...data,
              uhid: id,
            });
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
        Update
      </button>
    </div>
  );
};
