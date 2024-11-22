import { DateLike, humanizedDate, PatientResponse } from '@hospital/shared';
import Tooltip from '@mui/material/Tooltip';
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomTable } from '../../component/table';
import { routerConfig, TypingSpeed } from '../../utils/constants';
import { toPagination, toSortField } from '../../utils/sort-transform';
import { useDebounce } from '../../utils/use-debounce';
import { useParam } from '../../utils/use-param';
import { usePatientQuery } from './use-patient-query';

export const PatientTable = () => {
  const { param, updateParam } = useParam<'q'>();
  const search = param.q;
  const _search = useDebounce(search, TypingSpeed);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isRefetching } = usePatientQuery({
    paginate: toPagination(pagination),
    sort: toSortField(sorting),
    search: _search,
  });
  const columns = useMemo<MRT_ColumnDef<PatientResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        enableResizing: true,
        Header() {
          return (
            <Tooltip title={`Total Departments ${data?.meta.total}`}>
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
            <div className="flex items-center">
              <Link
                to={`${routerConfig.View}/${row?.original.uhid}`}
                className="px-4 text-blue-600 hover:text-blue-300"
              >
                {renderedCellValue}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: 'uhid',
        header: 'UHID',
        enableSorting: true,
      },
      {
        accessorKey: 'mobile',
        header: 'Phone Number',
        enableSorting: true,
      },
      {
        accessorKey: 'city',
        header: 'City',
        enableSorting: true,
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Visit',
        filterVariant: 'date-range',
        Cell: ({ renderedCellValue, cell }) => {
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
  return (
    <div className="flex flex-col gap-8">
      <CustomTable table={table} menu={[]} />
    </div>
  );
};
