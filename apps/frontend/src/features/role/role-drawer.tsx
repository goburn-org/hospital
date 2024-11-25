import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoleInput, createRoleSchema } from '@hospital/shared';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { useEsc } from '../../utils/use-esc';
import { useCreateRoleMutation, useUpdateRoleMutation } from './use-role-query';

export const RoleDrawer = ({
  defaultValues,
  mode,
  roleId,
}: {
  defaultValues?: CreateRoleInput;
  mode: 'create' | 'edit' | 'view';
  roleId?: string;
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues,
  });
  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  const editable = mode !== 'view';
  return (
    <div className="w-[500px]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-semibold capitalize text-gray-400">
          {mode} Role
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
      <p className="sm:col-span-6 text-sm text-red-500">
        {defaultValues?.isSuperAdmin ? 'Super Admin role' : ''}
      </p>
      <FormModeProvider
        mode={editable ? FormMode.Editable : FormMode.ReadOnly}
        oldId={roleId}
      >
        <FormProvider {...formProvider}>
          <form className="flex max-h-[90vh] flex-col gap-12">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <FormInput<CreateRoleInput>
                  isRequired
                  autoComplete="off"
                  id="roleName"
                  labelName="Role Name"
                  placeholder=" Admin"
                />
              </div>
              <div className="sm:col-span-6">
                <FormInput<CreateRoleInput>
                  autoComplete="off"
                  id="description"
                  labelName="Role Description"
                  placeholder=" Manages all the things"
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
          const path = `../../${routerConfig.Role}/${routerConfig.Edit}/${id}`;
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
  const formProvider = useFormContext<CreateRoleInput>();
  const { mutateAsync } = useCreateRoleMutation({
    onError: (err) => {
      if (err instanceof Error) {
        formProvider.setError('roleName', {
          message: err.message,
        });
      }
      formProvider.setError('roleName', {
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
  const formProvider = useFormContext<CreateRoleInput>();
  const { mutateAsync } = useUpdateRoleMutation({
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
              id: Number(id),
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
