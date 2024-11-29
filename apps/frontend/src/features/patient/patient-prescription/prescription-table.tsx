import { PencilIcon } from '@heroicons/react/24/outline';
import { CreatePatientPrescriptionRequest } from '@hospital/shared';
import { MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { MutableRefObject, useMemo } from 'react';
import { CustomTable } from '../../../component/table';

export const ShowPrescription = ({
  data,
  setEdit,
}: {
  data: CreatePatientPrescriptionRequest;
  setEdit: MutableRefObject<(idx: number) => void>;
}) => {
  const columns = useMemo<
    MRT_ColumnDef<CreatePatientPrescriptionRequest[number]>[]
  >(
    () => [
      {
        accessorKey: 'medicineName',
        header: 'Drug',
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
      },
      {
        accessorKey: 'dosage',
        header: 'Dosage',
      },
      {
        accessorKey: 'instruction',
        header: 'Instruction',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
      },
      {
        accessorKey: 'form',
        header: 'Form',
      },
      {
        id: 'action',
        header: 'Action',
        Cell: ({ row }) => {
          return (
            <button
              onClick={(e) => {
                e.preventDefault();
                setEdit.current(row.original.idx);
              }}
              className="btn-text-tertiary btn-small"
            >
              <PencilIcon className="w-5 h-5" width={12} />
            </button>
          );
        },
      },
    ],
    [setEdit],
    //end
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: { showColumnFilters: true },
    enablePagination: false,
    rowCount: data.length,
    state: {
      isLoading: false,
    },
  });
  return <CustomTable table={table} menu={[]} />;
};
