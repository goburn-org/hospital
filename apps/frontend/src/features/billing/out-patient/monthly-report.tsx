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
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableLoading } from '../../../component/page-loader';
import { CustomTable } from '../../../component/table';
import Tooltip from '../../../component/tooltip';
import { TypingSpeed } from '../../../utils/constants';
import { toPagination, toSortField } from '../../../utils/sort-transform';
import { useDebounce } from '../../../utils/use-debounce';
import { useParam } from '../../../utils/use-param';
import { useAllPatientBillingQuery } from '../../patient/use-patient-query';
import MonthlyReportFilter from './month-report-filter';
import { OpPatientReportTiles } from './op-report-tiles';

export const MonthlyReport = () => {
  const { param, updateParam } = useParam<
    'q' | 'orderIds' | 'status' | 'visitDate'
  >();
  const search = param.q;
  const _search = useDebounce(search, TypingSpeed);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const orderIds: string[] = JSON.parse(param.orderIds || '[]');
  const visitDate = JSON.parse(param.visitDate || '{}') as {
    from: Date;
    to: Date;
    id: string;
  };
  const { data, isLoading, isError, isRefetching } = useAllPatientBillingQuery({
    paginate: toPagination(pagination),
    sort: toSortField(sorting),
    search: _search,
    query: {
      orderIds,
      visitDate,
    },
  });

  const columns = useMemo<MRT_ColumnDef<AllPatientVisitBillingResponse>[]>(
    () => [
      {
        accessorKey: 'patient.name',
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
          const patientId = row.original.patient.uhid;
          return (
            <Link
              to={patientId}
              className="px-4 text-blue-600 hover:text-blue-300 flex gap-2"
            >
              {renderedCellValue}
            </Link>
          );
        },
      },
      {
        accessorKey: 'patient.uhid',
        header: 'UHID',
        enableSorting: true,
      },
      {
        accessorKey: 'patient.mobile',
        header: 'Phone Number',
        enableSorting: true,
      },
      {
        accessorKey: 'patient.city',
        header: 'City',
        enableSorting: true,
      },
      {
        accessorKey: 'patient.lastVisit',
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
      {
        accessorFn: ({ lastVisit }) => {
          const billing = lastVisit.receipt.reduce((acc, c) => acc + c.paid, 0);
          return billing;
        },
        header: 'Paid Till',
      },
      {
        accessorFn: ({ lastVisit }) => {
          const billing = lastVisit.billing.reduce(
            (acc, c) => acc + c.total,
            0,
          );
          return billing;
        },
        header: 'Total Billing',
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
  return (
    <div className="flex flex-col gap-4">
      <OpPatientReportTiles
        isLoading={isLoading}
        totalIncome={data?.totalBilling ?? 0}
        totalVisit={data?.totalVisit ?? 0}
      />

      {isLoading ? (
        <TableLoading />
      ) : (
        <div className="mx-8 flex flex-col">
          <MonthlyReportFilter />
          <CustomTable table={table} menu={[]} />
        </div>
      )}
    </div>
  );
};
