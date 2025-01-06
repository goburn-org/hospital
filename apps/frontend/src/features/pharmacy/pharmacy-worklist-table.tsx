import { CounterSaleResponse } from '@hospital/shared';
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableLoading } from '../../component/page-loader';
import { CustomTable } from '../../component/table';
import Tooltip from '../../component/tooltip';
import { routerConfig, TypingSpeed } from '../../utils/constants';
import { toPagination, toSortField } from '../../utils/sort-transform';
import { useDebounce } from '../../utils/use-debounce';
import { useParam } from '../../utils/use-param';
import { usePatientPrescriptionQuery } from './use-pharmacy-query';

export const PharmacyWorkListTable = () => {
  const { param, updateParam } = useParam<'q'>();
  const search = param.q;
  const _search = useDebounce(search, TypingSpeed.Medium);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isRefetching } =
    usePatientPrescriptionQuery({
      paginate: toPagination(pagination),
      sort: toSortField(sorting),
      search: _search,
    });
  const columns = useMemo<MRT_ColumnDef<CounterSaleResponse>[]>(
    () => [
      {
        accessorKey: 'customerName',
        header: 'Name',
        id: 'name',
        enableSorting: true,
        enableResizing: true,
        Header() {
          return (
            <Tooltip text={`Total Patient ${data?.meta.total}`}>
              <div className="flex items-center gap-2">
                <span>Name</span>
                <span className="text-sm text-gray-500">
                  ({data?.meta.total})
                </span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: 'CounterSaleBill.paid',
        header: 'Paid Amount',
        id: 'phone Number',
        enableSorting: true,
      },
      {
        id: 'action',
        header: 'Action',
        Cell: ({ row }) => {
          return (
            <Link
              to={`${routerConfig.Pharmacy}/${routerConfig.View}/${row.original.id}`}
              className="btn-text-tertiary btn-small"
            >
              Action
            </Link>
          );
        },
      },
    ],
    [data?.meta.total],
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data || [],
    initialState: { showColumnFilters: true },
    manualFiltering: false, //turn off built-in client-side filtering
    manualPagination: false, //turn off built-in client-side pagination
    manualSorting: false, //turn off built-in client-side sorting
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
    rowCount: data?.meta.total || 0,
    state: {
      globalFilter: search,
      isLoading,
      showAlertBanner: isError,
      pagination,
      showProgressBars: isRefetching,
      sorting,
    },
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <TableLoading />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <CustomTable table={table} menu={[]} />
    </div>
  );
};
