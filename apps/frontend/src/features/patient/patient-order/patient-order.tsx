import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePatientOrderRequest } from '@hospital/shared';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { RadioGroup } from '../../../component/checkbox';
import { FormInput } from '../../../component/form/form-input';
import { CustomSelect } from '../../../component/select';
import { useOrderQuery } from '../../../provider/use-order';
import { useDepartmentQuery } from '../../department/use-department-query';

type FormProps = {
  department: number;
  order: string;
  priority: string;
  remark: string;
};

export const OrderCreationForm = ({
  editId,
  setEditId,
}: {
  editId: string | null;
  setEditId: (id: string) => void;
}) => {
  const globalForm = useFormContext<CreatePatientOrderRequest>();
  const [departmentSearch, setDepartmentSearch] = useState('');
  const { data } = useDepartmentQuery({
    search: departmentSearch,
    paginate: {
      page: 1,
      limit: 10,
    },
  });
  const { data: orders } = useOrderQuery();
  const currentIds = globalForm.watch('order') || [];
  const formProvider = useForm<FormProps>({
    resolver: zodResolver(
      z.object({
        order: z.string(),
        priority: z.string(),
        remark: z.string().optional().nullable(),
      }),
    ),
    defaultValues: {
      priority: 'routine',
    },
  });
  useEffect(() => {
    if (!editId) {
      return;
    }
    const order = currentIds.find((o) => o.id === editId);
    if (order) {
      formProvider.setValue('order', order.id);
      formProvider.setValue('remark', order.remark || '');
    }
  }, [currentIds, editId, formProvider, setEditId]);
  const department = formProvider.watch('department');
  const onSubmit = formProvider.handleSubmit((data) => {
    if (editId) {
      globalForm.setValue(
        'order',
        currentIds.map((o) => {
          if (o.id === editId) {
            return {
              id: data.order,
              remark: data.remark,
            };
          }
          return o;
        }),
      );
      setEditId('');
      formProvider.reset();
      return;
    }
    globalForm.setValue('order', [
      ...currentIds,
      {
        id: data.order,
        remark: data.remark,
      },
    ]);
    formProvider.reset();
  });
  return (
    <FormProvider {...formProvider}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-12 px-4 py-6 bg-gray-50 rounded-lg pt-5">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6 2xl:col-span-2">
              <CustomSelect
                labelName="Department"
                htmlFor="department"
                onChange={(e) => {
                  formProvider.setValue('department', e);
                }}
                value={formProvider.watch('department')}
                options={
                  data?.data?.map((e) => ({ id: e.id, label: e.name })) ?? []
                }
                onRawChange={(e) => {
                  setDepartmentSearch(e);
                }}
                clearButton
              />
            </div>
            <div className="col-span-6 2xl:col-span-4">
              <CustomSelect
                labelName="Order Name"
                htmlFor="orderName"
                error={formProvider.formState.errors.order?.message}
                onChange={(e) => {
                  formProvider.setValue('order', e, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                value={formProvider.watch('order')}
                options={
                  orders
                    ?.filter((o) =>
                      department
                        ? o.departmentId === department ||
                          o.id === formProvider.getValues('order')
                        : true,
                    )
                    ?.map((e) => ({ id: e.id, label: e.name })) ?? []
                }
                clearButton
                isRequired
              />
            </div>
            <div className="col-span-6">
              <RadioGroup
                options={[
                  {
                    label: 'Routine',
                    value: 'routine',
                  },
                  {
                    label: 'Urgent',
                    value: 'urgent',
                  },
                ]}
                selectedValue={formProvider.watch('priority')}
                onChange={(e) => {
                  formProvider.setValue('priority', e, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                label="Priority"
                error={formProvider.formState.errors.priority?.message}
              />
            </div>
            <div className="col-span-6">
              <FormInput<FormProps>
                id="remark"
                labelName="Remark"
                autoComplete={'off'}
              />
            </div>
          </div>
          <div className="flex justify-between">
            {editId ? (
              <button
                type="reset"
                onClick={() => {
                  globalForm.setValue(
                    'order',
                    currentIds.filter((o) => o.id !== editId),
                  );
                  setEditId('');
                  formProvider.reset();
                }}
                className="btn-danger"
              >
                Delete
              </button>
            ) : (
              <>.</>
            )}
            <div className="flex flex-row-reverse gap-2">
              <button
                type="submit"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
              >
                {editId ? 'Update Order' : 'Add Order'}
              </button>
              {editId ? (
                <button
                  type="reset"
                  onClick={() => {
                    setEditId('');
                    formProvider.reset();
                  }}
                  className="btn-text"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="reset"
                  onClick={() => {
                    globalForm.setValue('order', []);
                  }}
                  className="btn-text"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
