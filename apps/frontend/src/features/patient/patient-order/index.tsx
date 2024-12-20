import { zodResolver } from '@hookform/resolvers/zod';
import {
  computeFinalPrice,
  CreatePatientOrderRequest,
  createPatientOrderSchema,
  ensure,
} from '@hospital/shared';
import { MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import PageLoading from '../../../component/page-loader';
import { CustomTable } from '../../../component/table';
import { useOrderQuery } from '../../../provider/use-order';
import { useTaxCode } from '../../../provider/use-tax-code';
import { routerConfig } from '../../../utils/constants';
import { TIMER_S, useTimer } from '../../../utils/use-timer';
import {
  usePatientOrderMutation,
  usePatientVisitByIdQuery,
} from '../use-patient-visit';
import { OrderCreationForm } from './patient-order';

const OrderTable = ({ onEdit }: { onEdit: (orderId: string) => void }) => {
  const { data, isLoading } = useOrderQuery();
  const { data: taxCode } = useTaxCode();
  const { watch } = useFormContext<CreatePatientOrderRequest>();
  const addedOrderDetails = useMemo(() => {
    const addedOrders = watch('order') || [];
    return addedOrders.map((order) => {
      const details = data?.find((o) => o.id === order.id);
      return {
        ...details,
        remark: order.remark,
      };
    });
  }, [data, watch]);
  const columns = useMemo<MRT_ColumnDef<(typeof addedOrderDetails)[number]>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Order Name',
        enableSorting: true,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="flex items-center">
              <Link
                to={`${routerConfig.View}/${row?.original.id}`}
                className="px-4 text-blue-600 hover:text-blue-300"
              >
                {renderedCellValue}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: 'remark',
        header: 'Remark',
      },
      {
        header: 'Rate',
        Cell: ({ row }) => {
          if (!row?.original.baseAmount) return null;
          const tax = taxCode?.find((t) => t.id === row?.original.taxCodeId);
          if (!tax) return null;
          const finalAmount = computeFinalPrice(row.original.baseAmount, tax);
          return <div>{finalAmount}</div>;
        },
      },
      {
        header: 'Action',
        Cell: ({ row }) => {
          const id = row?.original.id;
          return (
            <button
              className="btn-text btn-small"
              onClick={(e) => {
                e.preventDefault();
                id && onEdit(id);
              }}
            >
              Edit
            </button>
          );
        },
      },
    ],
    [taxCode],
    //end
  );

  const table = useMaterialReactTable({
    columns,
    enablePagination: false,
    state: {
      isLoading,
    },
    data: addedOrderDetails || [],
  });
  if (addedOrderDetails.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-gray-500">
        No Orders Added
      </div>
    );
  }
  return <CustomTable table={table} menu={[]} />;
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
  const [editId, setEditId] = useState<string | null>(null);
  return (
    <FormProvider {...formProvider}>
      <form
        onSubmit={formProvider.handleSubmit(async (data) => {
          await mutateAsync(data);
          setSaved(true);
          start(() => {
            setSaved(false);
          });
        })}
      >
        <div className="flex flex-col-reverse gap-12 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <OrderTable onEdit={setEditId} />
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(formProvider.formState.isValid);
                  formProvider.handleSubmit(async (data) => {
                    await mutateAsync(data);
                    setSaved(true);
                    toast.success('Order Created');
                    start(() => {
                      setSaved(false);
                    });
                  })();
                }}
                disabled={isPending || saved}
                className="btn-primary"
              >
                {isPending
                  ? 'Saving...'
                  : saved
                    ? 'Order Created'
                    : 'Create Order'}
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <OrderCreationForm editId={editId} setEditId={setEditId} />
          </div>
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
    <div className="w-[100vw] sm:w-[calc(100vw-133.8px)]">
      <Form
        defaultValue={{
          patientId,
          visitId,
          order: data.PatientOrder?.order ?? [],
          orderToDoctor: data.PatientOrder?.orderToDoctor ?? {},
        }}
      />
    </div>
  );
};
