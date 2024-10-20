import {
  MRT_TableInstance,
  flexRender,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  MRT_RowData,
  MRT_Row,
  useMRT_TableOptions,
} from 'material-react-table';
import { useState } from 'react';
import { OutsideClick } from './outside-click';
import { classNames } from '../utils/classNames';
import { LoadingButton } from './loading-button';
import { SortDirection } from '@mui/material';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

interface Menu<T extends MRT_RowData> {
  label: string;
  action: (row: MRT_Row<T> | null) => unknown;
  disabled?: (row: MRT_Row<T>) => boolean;
  icon?: React.ReactNode;
  hidden?: (row: MRT_Row<T>) => boolean;
}

const getSortIcon = (sort: SortDirection) => {
  if (sort === 'asc') {
    return '↓';
  } else if (sort === 'desc') {
    return '↑';
  }
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-4 w-4 flex-shrink-0"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3l-4 4 1.41 1.41L10 5.83l2.59 2.58L14 7 10 3zm0 14l4-4-1.41-1.41L10 14.17l-2.59-2.58L6 13l4 4z"
      />
    </svg>
  );
};

export const CustomTable = <T extends MRT_RowData>({
  table,
  menu,
}: {
  table: MRT_TableInstance<T>;
  menu: Menu<T>[];
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuRowData, setMenuRowData] = useState<MRT_Row<T> | null>(null);
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: MRT_Row<T>,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRowData(row);
  };
  const { enablePagination } = useMRT_TableOptions(table.options);

  // Close Menu Handlers
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowData(null);
  };

  const pageIndex = table.getState().pagination.pageIndex;
  const pageLength = table.getState().pagination.pageSize;
  const previousRowsLength = pageIndex * pageLength;
  const currentStart = previousRowsLength + 1;
  const currentEnd = currentStart + table.getRowModel().rows.length - 1;
  const totalRows = table.getRowCount();

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden shadow-md ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          {/* Use your own markup, customize however you want using the power of TanStack Table */}
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    key={header.id}
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.Header ??
                                header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                      {header.column.columnDef.enableSorting && (
                        <div className="flex">
                          <button
                            onClick={() => {
                              if (
                                header.column.getNextSortingOrder() == false
                              ) {
                                header.column.clearSorting();
                              } else {
                                table.setSorting([
                                  {
                                    desc:
                                      header.column.getNextSortingOrder() ===
                                      'asc'
                                        ? false
                                        : true,
                                    id: header.id,
                                  },
                                ]);
                              }
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {header.column.getIsSorted() ? (
                              header.column.getAutoSortDir() === 'asc' ? (
                                <span className="sr-only">
                                  Sorted Descending
                                </span>
                              ) : (
                                <span className="sr-only">
                                  Sorted Ascending
                                </span>
                              )
                            ) : (
                              <span className="sr-only">Not Sorted</span>
                            )}
                            {getSortIcon(header.column.getIsSorted())}
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    className={classNames(
                      idx === 0 ? 'text-gray-900' : 'text-gray-500',
                      'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6',
                    )}
                    key={cell.id}
                  >
                    {/* Use MRT's cell renderer that provides better logic than flexRender */}
                    <MRT_TableBodyCellValue
                      cell={cell}
                      table={table}
                      staticRowIndex={rowIndex} //just for batch row selection to work
                    />
                  </td>
                ))}
                {menu.length ? (
                  <td>
                    <button onClick={(event) => handleOpenMenu(event, row)}>
                      <EllipsisVerticalIcon />
                    </button>
                    {anchorEl && menuRowData?.index === rowIndex && (
                      <OutsideClick onOutsideClick={handleCloseMenu}>
                        <div
                          className="absolute z-10 mt-2 w-48 rounded-md border border-gray-400 bg-white drop-shadow-lg"
                          style={{
                            top: `${anchorEl.getBoundingClientRect().bottom + window.scrollY}px`,
                            left: `${anchorEl.getBoundingClientRect().left - 150}px`,
                          }}
                        >
                          <ul className="py-1">
                            {menu
                              .filter((i) => {
                                if (i.hidden) {
                                  return !i.hidden(menuRowData);
                                }
                                return true;
                              })
                              .map((menuItem) => (
                                <LoadingButton
                                  key={menuItem.label}
                                  onClick={async () => {
                                    if (
                                      menuItem.disabled &&
                                      menuItem.disabled(menuRowData)
                                    ) {
                                      return;
                                    }
                                    await menuItem.action(menuRowData);
                                    handleCloseMenu();
                                  }}
                                  className={classNames(
                                    menuItem.disabled &&
                                      menuItem.disabled(menuRowData)
                                      ? 'cursor-not-allowed bg-gray-200 text-sm text-gray-500'
                                      : 'cursor-pointer text-black hover:bg-white hover:text-primary',
                                    'block w-full justify-start px-4 py-2 text-start text-sm',
                                  )}
                                >
                                  <div className="flex items-center justify-start gap-4">
                                    {menuItem.icon}
                                    <p className="text-base">
                                      {menuItem.label}
                                    </p>
                                  </div>
                                </LoadingButton>
                              ))}
                          </ul>
                        </div>
                      </OutsideClick>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
      {enablePagination && (
        <div className="my-4 flex w-full items-center justify-between px-8">
          <span className="text-base text-gray-500">
            Showing {currentStart} to {currentEnd} of {totalRows} entries
          </span>
          <MRT_TablePagination table={table} showRowsPerPage />
        </div>
      )}
    </div>
  );
};
