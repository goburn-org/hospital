import { CustomTable } from '../../component/table';
import { useEmployeeQuery } from './use-employee-query';
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { routerConfig, TypingSpeed } from '../../utils/constants';
import { useParam } from '../../utils/use-param';
import { useDebounce } from '../../utils/use-debounce';
import { toPagination, toSortField } from '../../utils/sort-transform';
import { UserWithRolesAndDepartment } from '@hospital/shared';

export const EmployeeTable = () => {
  const { param, updateParam } = useParam<'q'>();
  const search = param.q;
  const _search = useDebounce(search, TypingSpeed);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isRefetching } = useEmployeeQuery({
    paginate: toPagination(pagination),
    sort: toSortField(sorting),
    search: _search,
  });
  const columns = useMemo<MRT_ColumnDef<UserWithRolesAndDepartment>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee Name',
        enableSorting: true,
        Header() {
          return (
            <Tooltip title={`Total Departments ${data?.meta.total}`}>
              <div className="flex items-center gap-2">
                <span>Employee Name</span>
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
        accessorKey: 'department',
        accessorFn: (row) => row.Department?.name,
        header: 'Department',
        Cell: ({ renderedCellValue, cell }) => {
          return <div>{renderedCellValue}</div>;
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    [data?.meta.total],
    //end
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data || [],
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
