import { useState } from 'react';
import DentalChart from './dental-chart';

interface ToothData {
  id: string | number;
  status: string;
  notes: string;
}

export const DentalAssessment = () => {
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);
  const [teethData, setTeethData] = useState<
    Record<string | number, ToothData>
  >({});

  const handleToothClick = (toothId: string | number) => {
    const toothData = teethData[toothId] || {
      id: toothId,
      status: '',
      notes: '',
    };
    setSelectedTooth(toothData);
  };

  const handleInputChange = (field: 'status' | 'notes', value: string) => {
    if (!selectedTooth) return;

    const updatedTooth = {
      ...selectedTooth,
      [field]: value,
    };

    setTeethData((prev) => ({
      ...prev,
      [selectedTooth.id]: updatedTooth,
    }));
    setSelectedTooth(updatedTooth);
  };

  return (
    <div className="flex h-full">
      {/* Left side - Teeth Diagram */}
      <div className="w-full border-r p-4">
        <h3 className="text-lg font-semibold mb-4">Dental Chart</h3>
        <DentalChart
          selectedToothId={selectedTooth?.id || null}
          onToothSelect={handleToothClick}
        />
      </div>

      {/* Right side - Input Form */}
      <div className="w-1/2 p-4">
        {selectedTooth ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tooth #{selectedTooth.id}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={selectedTooth.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="healthy">Healthy</option>
                <option value="cavity">Cavity</option>
                <option value="filled">Filled</option>
                <option value="missing">Missing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={selectedTooth.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select a tooth to add details
          </div>
        )}
      </div>
    </div>
  );
};
