import { GrnResponse, humanizedDate } from '@hospital/shared';
import { MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TableLoading } from '../../component/page-loader';
import { CustomTable } from '../../component/table';
import Tooltip from '../../component/tooltip';
import { routerConfig } from '../../utils/constants';
import { useParam } from '../../utils/use-param';
import { useGrnQuery } from './use-pharmacy-query';

export const GrnTable = () => {
  const { param, updateParam } = useParam<'q'>();
  const search = param.q;
  const { data, isLoading, isError, isRefetching } = useGrnQuery();
  const columns = useMemo<MRT_ColumnDef<GrnResponse>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Name',
        id: 'name',
        enableSorting: true,
        enableResizing: true,
        Header() {
          return (
            <Tooltip text={`Total Patient ${data?.length}`}>
              <div className="flex items-center gap-2">
                <span>Created At</span>
                <span className="text-sm text-gray-500">({data?.length})</span>
              </div>
            </Tooltip>
          );
        },
        Cell: ({ row }) => {
          return <span>{humanizedDate(row.original.createdAt)}</span>;
        },
      },
      {
        header: 'Paid Amount',
        id: 'paidAmount',
        enableSorting: true,
        Cell: ({ row }) => {
          const paidAmount = row.original.json.grnLineItem.reduce(
            (acc, d) => acc + d.costPrice,
            0,
          );
          return <span>{paidAmount}</span>;
        },
      },
      {
        id: 'action',
        header: 'Action',
        Cell: ({ row }) => {
          return (
            <Link
              to={`${routerConfig.Grn}/${routerConfig.View}/${row.original.id}`}
              className="btn-text-tertiary btn-small"
            >
              View
            </Link>
          );
        },
      },
    ],
    [data?.length],
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: { showColumnFilters: true },
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
    onGlobalFilterChange: (value) => updateParam('q', value ?? ''),
    paginateExpandedRows: true,
    state: {
      globalFilter: search,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
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
