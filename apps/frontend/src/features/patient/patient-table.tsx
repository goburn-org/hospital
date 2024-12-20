import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { DateLike, humanizedDate, PatientResponse } from '@hospital/shared';
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomTable } from '../../component/table';
import Tooltip from '../../component/tooltip';
import { useUserQuery } from '../../component/user-query';
import { useVisitDrawer } from '../../provider/patient-drawer-context-provider';
import { routerConfig, TypingSpeed } from '../../utils/constants';
import { toPagination, toSortField } from '../../utils/sort-transform';
import { useDebounce } from '../../utils/use-debounce';
import { useParam } from '../../utils/use-param';
import {
  usePatientQuery,
  usePatientVisitOpenMutation,
} from './use-patient-query';

export const PatientTable = () => {
  const { param, updateParam } = useParam<'q'>();
  const search = param.q;
  const _search = useDebounce(search, TypingSpeed.Medium);
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
  const { show } = useVisitDrawer();
  const { data: user } = useUserQuery();
  const navigate = useNavigate();
  const { mutateAsync } = usePatientVisitOpenMutation();
  const columns = useMemo<MRT_ColumnDef<PatientResponse>[]>(
    () => [
      {
        accessorKey: 'name',
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
            <div className="flex items-center">
              <Link
                to={`${row?.original.uhid}`}
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
        accessorKey: 'area',
        header: 'Area',
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.lastVisit?.checkInTime,
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
        id: 'action',
        header: 'Action',
        Cell: ({ row }) => {
          const isCheckout =
            row.original.lastVisit && row.original.lastVisit.checkOutTime;
          if (isCheckout || !row.original.lastVisit) {
            return (
              <Link
                to={`${row.original.uhid}/visit/${routerConfig.New}`}
                className="btn-text btn-small"
              >
                New Visit
              </Link>
            );
          }

          if (isCheckout || !row.original.lastVisit) {
            return (
              <Link
                to={`${row.original.uhid}/visit/${routerConfig.New}`}
                className="btn-text btn-small"
              >
                New Visit
              </Link>
            );
          }
          const designatedDocIds = Object.values(
            row.original.lastVisit.PatientOrder?.orderToDoctor ?? {},
          );
          const isDesignatedDoctor = designatedDocIds.includes(user?.id ?? '');
          if (!isDesignatedDoctor) {
            return (
              <Link
                className="btn-text-tertiary btn-small"
                to={`${row.original.uhid}/visit/${row.original.lastVisit?.id}/${routerConfig.Edit}`}
              >
                Add Order
              </Link>
            );
          }
          if (row.original.lastVisit && !row.original.lastVisit.orderOpenedAt) {
            return (
              <button
                onClick={async () => {
                  await mutateAsync({
                    patientId: row.original.uhid,
                    visitId: row.original.lastVisit!.id,
                  });
                  navigate(
                    `${row.original.uhid}/visit/${row.original.lastVisit?.id}`,
                  );
                }}
                className="btn-text-tertiary btn-small"
              >
                Open Order
              </button>
            );
          }
          return (
            <Link
              to={`${row.original.uhid}/visit/${row.original.lastVisit?.id}`}
              className="btn-text-tertiary btn-small"
            >
              View Last Visit
            </Link>
          );
        },
      },
    ],
    [data?.meta.total, mutateAsync, navigate, user?.id],
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
      <CustomTable
        table={table}
        menu={[
          {
            label: 'View Past Visits',
            hidden: (r) => !r?.original.lastVisit?.id,
            action: (row) => {
              if (row?.original.lastVisit?.id) {
                show(row?.original.lastVisit?.id, row?.original.uhid);
              }
            },
            icon: <ArchiveBoxIcon width={24} />,
          },
          {
            label: 'No Past Visits',
            disabled: () => true,
            hidden: (r) => !!r?.original.lastVisit?.id,
            action: () => {
              return;
            },
            icon: <ArchiveBoxIcon width={24} />,
          },
        ]}
      />
    </div>
  );
};
