import { FC, ReactNode } from 'react';

export const Tile: FC<{
  label: ReactNode;
  value: ReactNode;
}> = ({ label, value }) => {
  return (
    <div className="overflow-hidden bg-gray-100 shadow sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 flex justify-center text-lg text-black">
              {value}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export const TileLoader: FC = () => {
  return (
    <div className="overflow-hidden bg-gray-200 shadow sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8">
          <div className="sm:col-span-1">
            <div className="mb-4 h-8 w-[10ch] animate-pulse bg-gray-300"></div>
            <div className="h-8 w-[4ch] animate-pulse bg-gray-300"></div>
          </div>
        </dl>
      </div>
    </div>
  );
};
