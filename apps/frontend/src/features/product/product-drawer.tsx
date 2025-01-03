import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductInput, createProductSchema } from '@hospital/shared';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormCheckbox } from '../../component/form/form-checkbox';
import { FormInput } from '../../component/form/form-input';
import { CustomSelect, SelectOption } from '../../component/select';
import {
  FormMode,
  FormModeProvider,
  useFormMode,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { useEsc } from '../../utils/use-esc';
import { useAllDepartmentQuery } from '../department/use-department-query';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from './use-product-query';
import { useUomQuery } from './use-uom-query';

export const ProductDrawer = ({
  defaultValues,
  mode,
  departmentId,
}: {
  defaultValues?: CreateProductInput;
  mode: 'create' | 'edit' | 'view';
  departmentId?: string;
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });
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
          {mode} Product
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
              <div className="sm:col-span-2">
                <FormInput<CreateProductInput>
                  isRequired
                  autoComplete="off"
                  id="hsnCode"
                  labelName="HSN"
                  placeholder=" 123456"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateProductInput>
                  isRequired
                  id="name"
                  labelName="	Item name"
                  placeholder=" Crocin"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-2">
                <UOM />
              </div>
              <div className="sm:col-span-2">
                <FormCheckbox<CreateProductInput>
                  isRequired
                  id="branded"
                  labelName="Branded"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateProductInput>
                  isRequired
                  id="genericName"
                  labelName="Generic Name"
                  placeholder=" Paracetamol"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateProductInput>
                  isRequired
                  id="manufacturer"
                  labelName="Manufacturer"
                  placeholder=" Tablet"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreateProductInput>
                  isRequired
                  id="hsnCode"
                  labelName="Hsn Code"
                  placeholder=" 123456"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreateProductInput>
                  isRequired
                  id="sku"
                  labelName="SKU Code"
                  placeholder=" 123456"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreateProductInput>
                  isRequired
                  id="maxDiscount"
                  labelName="Max Discount"
                  placeholder=" 20"
                  type="number"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-3">
                <DepartmentSelect />
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

const UOM = () => {
  const { data } = useUomQuery();
  const { watch, setValue } = useFormContext<CreateProductInput>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  return (
    <CustomSelect
      isRequired
      disabled={isReadOnly}
      htmlFor="uom"
      labelName="UOM"
      options={
        data?.map((d) => ({
          id: d.id,
          label: d.name,
        })) || []
      }
      value={watch('uom')}
      onChange={function (value) {
        setValue('uom', value);
      }}
    />
  );
};

const DepartmentSelect = () => {
  const { data, isLoading } = useAllDepartmentQuery();
  const { watch, setValue } = useFormContext<CreateProductInput>();
  const isReadOnly = useFormMode() === FormMode.ReadOnly;
  return (
    <CustomSelect
      multiple
      isRequired
      disabled={isReadOnly}
      isLoading={isLoading}
      htmlFor="chargeHead"
      labelName="Department"
      options={data?.data.map(
        (d): SelectOption => ({
          id: d.id,
          label: d.name,
        }),
      )}
      value={watch('chargeHead')}
      onChange={function (value) {
        setValue('chargeHead', value as number[]);
      }}
    />
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
          const path = `../../${routerConfig.Inventory}/${routerConfig.Edit}/${id}`;
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
  const formProvider = useFormContext<CreateProductInput>();
  const { mutateAsync } = useCreateProductMutation({
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
          console.log(formProvider.formState.errors);
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
  const formProvider = useFormContext<CreateProductInput>();
  const { mutateAsync } = useUpdateProductMutation({
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
          console.log(formProvider.formState.errors);
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
