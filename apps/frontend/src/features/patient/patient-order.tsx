import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientOrderRequest,
  createPatientOrderSchema,
  ensure,
} from '@hospital/shared';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { FaceList } from '../../component/face-list';
import PageLoading from '../../component/page-loader';
import { useOrderQuery } from '../../provider/use-order';
import { useParam } from '../../utils/use-param';
import { TIMER_S, useTimer } from '../../utils/use-timer';
import {
  usePatientOrderMutation,
  usePatientVisitByIdQuery,
} from './use-patient-visit';

const OrderEditor = () => {
  const { watch, formState, setValue } =
    useFormContext<CreatePatientOrderRequest>();
  const { data } = useOrderQuery();
  const error = formState.errors['order'];
  const uniqueDepartment = Array.from(new Set(data?.map((d) => d.orderDeptId)));
  const { param } = useParam<'q'>();
  const search = param.q ?? '';
  return (
    <div className="relative sm:col-span-6 max-h-[75vh]">
      {error && (
        <p className="text-red-500 text-sm font-semibold">{error.message}</p>
      )}
      <div className="flex items-center justify-between sticky top-0 left-0 bg-white py-3 px-2 "></div>
      <div className="px-4 max-h-[55vh] overflow-auto">
        {data?.filter((o) =>
          o.name.toLowerCase().includes(search.toLowerCase()),
        ).length === 0 && (
          <div className="text-gray-500 font-semibold text-xl h-20 w-full flex items-center justify-center">
            No orders found
          </div>
        )}
        {uniqueDepartment
          .filter((id) => {
            const deptOrders = data?.filter((d) => d.orderDeptId === id) ?? [];
            return deptOrders.some((order) =>
              order.name.toLowerCase().includes(search.toLowerCase()),
            );
          })
          .map((deptId) => {
            const deptOrders = data?.filter((d) => d.orderDeptId === deptId);
            return (
              <div key={deptId}>
                <h3 className="text-base/7 font-semibold text-gray-500 border-b border-gray-900/10 pb-1">
                  {deptOrders?.[0].orderDeptName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {deptOrders
                    ?.filter((o) =>
                      o.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    ?.map((order) => (
                      <div key={order.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={order.id}
                          checked={watch('order')?.some(
                            (o) => o.id === order.id,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue('order', [
                                ...(watch('order') ?? []),
                                { id: order.id },
                              ]);
                            } else {
                              setValue(
                                'order',
                                (watch('order') ?? []).filter(
                                  (o) => o.id !== order.id,
                                ),
                              );
                            }
                          }}
                        />
                        <label htmlFor={order.id}>
                          <FaceList string={order.name} search={search} />
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
      <div className="sticky bottom-[-150px] flex gap-2 flex-wrap max-h-[150px] overflow-auto">
        {watch('order')?.map((o) => (
          <div
            className="px-2 py-2 bg-slate-300 rounded-md text-sm text-gray-600 flex gap-2 "
            key={o.id}
          >
            <p className="max-w-[25ch] text-ellipsis whitespace-nowrap overflow-hidden">
              {data?.find((d) => d.id === o.id)?.name}
            </p>
            <button
              className="btn-outline btn-small"
              type="button"
              onClick={(e) => {
                setValue(
                  'order',
                  (watch('order') ?? []).filter((order) => order.id !== o.id),
                );
              }}
            >
              <XMarkIcon width={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Form = ({
  defaultValue,
}: {
  defaultValue?: CreatePatientOrderRequest;
}) => {
  const { mutateAsync, isPending } = usePatientOrderMutation();
  const [saved, setSaved] = useState(false);
  const [start] = useTimer(TIMER_S);
  const formProvider = useForm<CreatePatientOrderRequest>({
    defaultValues: defaultValue,
    resolver: zodResolver(createPatientOrderSchema),
  });
  return (
    <FormProvider {...formProvider}>
      <form
        className="flex flex-col bg-gray-50 rounded-lg "
        onSubmit={formProvider.handleSubmit(async (data) => {
          await mutateAsync(data);
          toast.success('Order Saved');
          setSaved(true);
          start(() => {
            setSaved(false);
          });
        })}
      >
        <div className="flex flex-col gap-2">
          <div className="border-gray-900/10  sm:space-y-0 sm:pb-0">
            <OrderEditor />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 p-4">
          <button
            type="reset"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Reset
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {saved ? (
              <>
                <CheckIcon className="w-5 h-5" width={24} />
                Saved
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export const PatientOrder = () => {
  const { patientId, visitId } = useParams();
  ensure(patientId, 'patientId is required');
  ensure(visitId, 'visitId is required');
  const { data, isLoading } = usePatientVisitByIdQuery({ patientId, visitId });
  if (isLoading) {
    return <PageLoading />;
  }
  if (!data) {
    return <div>Visit Not not found</div>;
  }
  return (
    <Form
      defaultValue={{
        patientId,
        visitId,
        order: data.PatientOrder?.order ?? [],
      }}
    />
  );
};
