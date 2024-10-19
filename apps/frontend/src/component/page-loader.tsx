const SidebarLoading = () => {
  return (
    <div className="h-full w-64 bg-gray-200 p-4">
      <div className="mb-4 h-10 w-full animate-pulse bg-gray-300"></div>
      <div className="space-y-2">
        <div className="h-6 w-full animate-pulse bg-gray-300"></div>
        <div className="h-6 w-full animate-pulse bg-gray-300"></div>
        <div className="h-6 w-full animate-pulse bg-gray-300"></div>
      </div>
    </div>
  );
};

const HeaderLoading = () => {
  return (
    <div className="flex w-full items-center justify-between bg-gray-200 p-4">
      <div className="h-10 w-1/4 animate-pulse bg-gray-300"></div>
      <div className="h-10 w-1/6 animate-pulse bg-gray-300"></div>
    </div>
  );
};

export const TableLoading = () => {
  return (
    <div className="p-4">
      <div className="mb-4 h-8 w-full animate-pulse bg-gray-300"></div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-6 w-full animate-pulse bg-gray-300"
          ></div>
        ))}
      </div>
    </div>
  );
};

export const RowLoading = ({
  column,
  rows,
}: {
  column: number;
  rows: number;
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: column }).map((_, index) => (
            <td
              key={index}
              className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
            >
              <div className="h-4 w-1/2 animate-pulse bg-gray-300"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const PageLoading = () => {
  return (
    <div className="flex h-screen">
      <SidebarLoading />
      <div className="flex flex-1 flex-col">
        <HeaderLoading />
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <TableLoading />
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
