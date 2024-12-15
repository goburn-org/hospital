import { ConsultationTile } from '../patient/consultation-tile';
import { OrderTile } from '../patient/order-token';

const SectionHeader = ({ title }: { title: string }) => {
  return <h2 className="text-xl font-bold text-gray-700">{title}</h2>;
};

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-500">Reports</h1>
      </div>
      <div className="flex flex-col gap-2 mb-8">
        <SectionHeader title="Consultation Token" />
        <ConsultationTile />
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <SectionHeader title="Order Token" />
        <OrderTile />
      </div>
    </div>
  );
};
