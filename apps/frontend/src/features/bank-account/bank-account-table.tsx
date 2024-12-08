import { BankAccountResponse } from '@hospital/shared';
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomTable } from '../../component/table';
import Tooltip from '../../component/tooltip';
import {
  useBankAccountActiveMutation,
  useBankAccounts,
} from '../../provider/use-bank-account';
import { routerConfig } from '../../utils/constants';
import { useParam } from '../../utils/use-param';

export const BankAccountTable = () => {
  const { param, updateParam } = useParam<'q'>();
  const search = param.q;
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isRefetching } = useBankAccounts();
  const { mutateAsync } = useBankAccountActiveMutation();
  const columns = useMemo<MRT_ColumnDef<BankAccountResponse[number]>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        Header() {
          return (
            <Tooltip text={`Total Products ${data?.length}`}>
              <div className="flex items-center gap-2">
                <span>Name</span>
                <span className="text-sm text-gray-500">({data?.length})</span>
              </div>
            </Tooltip>
          );
        },
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
        accessorKey: 'accountNumber',
        header: 'Account Number',
        enableSorting: true,
      },
      {
        accessorKey: 'isActive',
        header: 'Is Active',
        enableSorting: true,
        Cell: ({ row }) => {
          const isActive = row?.original.isActive;
          return (
            <input
              type="checkbox"
              checked={isActive}
              className="cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                mutateAsync({
                  id: row.original.id,
                  isActive: !isActive,
                });
              }}
            />
          );
        },
      },
    ],
    [data?.length, mutateAsync],
    //end
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined',
    },
    paginationDisplayMode: 'pages',
    onPaginationChange: setPagination,
    onGlobalFilterChange: (value) => updateParam('q', value ?? ''),
    onSortingChange: setSorting,
    paginateExpandedRows: true,
    rowCount: data?.length || 0,
    state: {
      globalFilter: search,
      isLoading,
      showAlertBanner: isError,
      pagination,
      showProgressBars: isRefetching,
      sorting,
    },
  });
  return (
    <div className="flex flex-col gap-8">
      <CustomTable table={table} menu={[]} />
    </div>
  );
};
