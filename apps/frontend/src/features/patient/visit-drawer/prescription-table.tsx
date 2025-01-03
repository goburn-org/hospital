import { CreatePatientPrescriptionRequest, Maybe } from '@hospital/shared';

export const PrescriptionTable = ({
  prescriptions,
}: {
  prescriptions: Maybe<CreatePatientPrescriptionRequest>;
}) => {
  if (!prescriptions || prescriptions.length === 0) {
    return <p className="p-4 text-gray-500">No prescriptions</p>;
  }
  return (
    <div className="p-4">
      <table className="min-w-full table-fixed border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border border-gray-300">Drug</th>
            <th className="p-2 border border-gray-300">Frequency</th>
            <th className="p-2 border border-gray-300">Duration</th>
            <th className="p-2 border border-gray-300">Instruction</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border border-gray-300">
                {item.medicineName}
              </td>
              <td className="p-2 border border-gray-300">{item.frequency}</td>
              <td className="p-2 border border-gray-300">{item.duration}</td>
              <td className="p-2 border border-gray-300">{item.instruction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
