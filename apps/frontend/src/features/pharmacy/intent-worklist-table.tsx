import { IntentResponse } from '@hospital/shared';
import { MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';
import { TableLoading } from '../../component/page-loader';
import { CustomTable } from '../../component/table';
import Tooltip from '../../component/tooltip';
import { useIntentQuery } from './use-pharmacy-query';

export const IntentWorkListTable = () => {
  const { data, isLoading, isError, isRefetching } = useIntentQuery();
  const columns = useMemo<MRT_ColumnDef<IntentResponse>[]>(
    () => [
      {
        header: 'Intent Items',
        id: 'intentItems',
        enableSorting: true,
        enableResizing: true,
        Header() {
          return (
            <Tooltip text={`Total Patient ${data?.length}`}>
              <div className="flex items-center gap-2">
                <span>Name</span>
                <span className="text-sm text-gray-500">({data?.length})</span>
              </div>
            </Tooltip>
          );
        },
        Cell({ row }) {
          return (
            <div className="flex items-center gap-2">
              {row.original.json.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-2 bg-slate-300 px-2 py-1 rounded-md"
                >
                  <span>{item.productId}</span>
                  <span className="text-sm text-gray-500">
                    ({item.quantity})
                  </span>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
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
    paginationDisplayMode: 'pages',
    paginateExpandedRows: true,
    rowCount: data?.length || 0,
    state: {
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
