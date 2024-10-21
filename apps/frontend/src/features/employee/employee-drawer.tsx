import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateEmployeeInput,
  createEmployeeSchema,
  UpdateEmployeeInput,
  updateEmployeeSchema,
} from '@hospital/shared';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import { FormSelect } from '../../component/form/form-select';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { useEsc } from '../../utils/use-esc';
import { useAllDepartmentQuery } from '../department/use-department-query';
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from './use-employee-query';
import { useAllRoleQuery } from '../role/use-role-query';

export const EmployeeDrawer = ({
  defaultValues,
  mode,
  departmentId,
}: {
  defaultValues?: CreateEmployeeInput | UpdateEmployeeInput;
  mode: 'create' | 'edit' | 'view';
  departmentId?: string;
}) => {
  const navigate = useNavigate();
  const { data: department, isLoading: isDepartmentLoading } =
    useAllDepartmentQuery();
  const { data: roles, isLoading: isRoleLoading } = useAllRoleQuery();
  const formProvider = useForm<CreateEmployeeInput>({
    resolver: zodResolver(
      mode === 'create' ? createEmployeeSchema : updateEmployeeSchema,
    ),
    defaultValues,
  });
  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  const editable = mode !== 'view';
  return (
    <div className="w-[750px]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-semibold capitalize text-gray-400">
          {mode} Employee
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
        oldId={departmentId}
      >
        <FormProvider {...formProvider}>
          <form className="flex max-h-[90vh] flex-col gap-12">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormInput<CreateEmployeeInput>
                  isRequired
                  autoComplete="off"
                  id="name"
                  labelName="Name"
                  placeholder=" John Doe"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreateEmployeeInput>
                  isRequired
                  disabled={mode !== 'create'}
                  autoComplete="off"
                  id="email"
                  labelName="Email"
                  placeholder=" abc@example.com"
                />
              </div>
              <div className="sm:col-span-4">
                <FormInput<CreateEmployeeInput>
                  isRequired
                  autoComplete="off"
                  id="phoneNumber"
                  labelName="Phone Number"
                  placeholder=" 1234567890"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreateEmployeeInput>
                  isRequired
                  autoComplete="off"
                  id="password.newPassword"
                  labelName="New Password"
                  placeholder=" ********"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreateEmployeeInput>
                  isRequired
                  autoComplete="off"
                  id="password.confirmPassword"
                  labelName="Confirm Password"
                  placeholder=" ********"
                />
                {formProvider.watch('password.newPassword') !==
                  formProvider.watch('password.confirmPassword') && (
                  <span className="text-sm text-red-500">
                    Passwords do not match
                  </span>
                )}
              </div>
              <div className="sm:col-span-3">
                <FormSelect<CreateEmployeeInput>
                  isRequired
                  id="department"
                  labelName="Department"
                  options={department?.data.map((d) => ({
                    label: d.name,
                    id: d.id,
                  }))}
                  isLoading={isDepartmentLoading}
                />
              </div>
              <div className="sm:col-span-3">
                <FormSelect<CreateEmployeeInput>
                  id="roles"
                  labelName="Role"
                  options={roles?.data.map((d) => ({
                    label: d.roleName,
                    id: String(d.id),
                  }))}
                  isLoading={isRoleLoading}
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
          const path = `../../${routerConfig.Employee}/${routerConfig.Edit}/${id}`;
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
  const formProvider = useFormContext<CreateEmployeeInput>();
  const { mutateAsync } = useCreateEmployeeMutation({
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
  const formProvider = useFormContext<CreateEmployeeInput>();
  const { mutateAsync } = useUpdateEmployeeMutation({
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
              id: id,
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
