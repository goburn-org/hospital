import { humanizedDate } from '@hospital/shared';
import { useVisitDrawer } from '../../provider/patient-drawer-context-provider';
import { classNames } from '../../utils/classNames';
import { usePatientVisitHistoryQuery } from './use-patient-visit';

export const VisitHistory = ({ patientId }: { patientId: string }) => {
  const { data: visitHistory } = usePatientVisitHistoryQuery(patientId);
  const { show, state } = useVisitDrawer();
  const closedVisit = visitHistory?.data?.filter((visit) => visit.checkOutTime);

  return (
    <div className="flex gap-2 items-center mb-4">
      <p className="text-gray-500 text-sm">Past Visits:</p>
      <div className="flex flex-row gap-4 max-w-[45vw] overflow-auto ml-2 py-2">
        {closedVisit?.length === 0 && (
          <p className="text-sm text-gray-500">No past visits</p>
        )}
        {closedVisit?.map((visit) => (
          <button
            key={visit.id}
            className={classNames(
              state?.show && state.visitId === visit.id
                ? ''
                : 'transform transition-transform duration-300 ease-in-out hover:scale-105',
            )}
            onClick={() => {
              show(visit.id, patientId);
            }}
          >
            <div
              className={classNames(
                state?.show && state.visitId === visit.id
                  ? 'bg-indigo-300'
                  : 'bg-gray-200',
                'inline-block  text-gray-800 p-1 rounded-md whitespace-nowrap',
              )}
            >
              {humanizedDate(visit.checkInTime)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
