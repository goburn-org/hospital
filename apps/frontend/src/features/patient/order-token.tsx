import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Tile, TileLoader } from '../../component/tiles';
import Tooltip from '../../component/tooltip';
import { useOrderTokenQuery } from './use-patient-visit';

const ElaspedETA = ({ unCompletedToken }: { unCompletedToken: number }) => {
  const TimerPerPatient = 60 * 60; // 1 hour
  const totalTime = unCompletedToken * TimerPerPatient;
  const now = new Date();
  const eta = new Date(now.getTime() + totalTime * 1000);
  return (
    <span className="flex flex-row gap-1 items-center justify-center">
      <p className="text-sm text-gray-500">New Visit @</p>
      <p className="text-lg text-gray-500">
        {eta.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h12',
        })}
      </p>
    </span>
  );
};

export const OrderTile = () => {
  const { data, isLoading } = useOrderTokenQuery();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        <TileLoader />
        <TileLoader />
        <TileLoader />
        <TileLoader />
      </div>
    );
  }
  return (
    <div className="hidden lg:grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {Object.values(data || {}).map((value) => (
        <Tile
          label={<span className="text-gray-700">{value.orderName}</span>}
          value={
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-1">
                <p className="text-lg text-black">
                  {value.completed}/{value.total}
                </p>
                <Tooltip text="Total Token / Completed Token">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-gray-400" />
                </Tooltip>
              </div>
              <ElaspedETA unCompletedToken={value.total - value.completed} />
            </div>
          }
        />
      ))}
    </div>
  );
};
