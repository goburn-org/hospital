import {
  AllPatientVisitBillingResponse,
  DateLike,
  humanizedDate,
} from '@hospital/shared';
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { TableLoading } from '../../../component/page-loader';
import { CustomTable } from '../../../component/table';
import Tooltip from '../../../component/tooltip';
import { TypingSpeed } from '../../../utils/constants';
import { toPagination, toSortField } from '../../../utils/sort-transform';
import { useDebounce } from '../../../utils/use-debounce';
import { useParam } from '../../../utils/use-param';
import { useAllOrderBillingQuery } from '../../patient/use-patient-query';

export const OrderWiseReport = () => {
  const { param, updateParam, resetAll } = useParam<'q'>();
  const search = param.q;
  const _search = useDebounce(search, TypingSpeed.Medium);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isRefetching } = useAllOrderBillingQuery({
    paginate: toPagination(pagination),
    sort: toSortField(sorting),
    search: _search,
  });

  useEffect(() => {
    resetAll();
  }, []);

  const columns = useMemo<MRT_ColumnDef<AllPatientVisitBillingResponse>[]>(
    () => [
      {
        accessorKey: 'order.name',
        header: 'Name',
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
        Cell: ({ renderedCellValue, row }) => {
          return (
            <button className="px-4 text-blue-600 hover:text-blue-300 flex gap-2">
              {renderedCellValue}
            </button>
          );
        },
      },
      {
        accessorKey: 'Visit.Patient.uhid',
        header: 'UHID',
        enableSorting: true,
      },
      {
        accessorKey: 'Visit.Patient.name',
        header: 'Patient Name',
        enableSorting: true,
      },
      {
        accessorKey: 'order.createdAt',
        header: 'Last Visit',
        filterVariant: 'date-range',
        Cell: ({ cell }) => {
          const value = cell.getValue() as DateLike | undefined;
          if (!value) {
            return null;
          }
          return (
            <div className="flex items-center gap-2">
              <span>{humanizedDate(value)}</span>
            </div>
          );
        },
      },
    ],
    [data?.meta.total],
    //end
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
    return <TableLoading />;
  }
  return (
    <div className="flex flex-col gap-8">
      <CustomTable table={table} menu={[]} />
    </div>
  );
};
