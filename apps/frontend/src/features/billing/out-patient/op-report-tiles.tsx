import { Rupees } from '../../../component/rupees';
import { Tile, TileLoader } from '../../../component/tiles';

export const OpPatientReportTiles = ({
  isLoading,
  totalIncome,
  totalVisit,
}: {
  isLoading: boolean;
  totalVisit: number;
  totalIncome: number;
}) => {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      <Tile
        label={<span className="text-blue-400">Total Visit</span>}
        value={totalVisit}
      />
      <Tile
        label={<span className="text-red-400">Total Income</span>}
        value={<Rupees amount={totalIncome} />}
      />
    </div>
  );
};
