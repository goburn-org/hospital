import {
  CreateAssessmentRequest,
  DetailedPatientVisit,
  humanizedDate,
  Maybe,
  TimeSeriesType,
} from '@hospital/shared';
import { Divider } from '@mui/material';
import { useState } from 'react';
import { CustomEditor } from '../../../component/editor';
import { useOrderQuery } from '../../../provider/use-order';
import { classNames } from '../../../utils/classNames';
import { VisitHistory } from '../visit-history';
import { DrawerSession } from './drawer-session';
import { PrescriptionTable } from './prescription-table';

const SessionText = ({
  k,
  val,
}: {
  k: string;
  val: Maybe<string | number | TimeSeriesType>;
}) => (
  <div
    className={classNames(
      'flex flex-col gap-1 lg:grid lg:grid-cols-6 lg:gap-4 py-2 lg:py-1',
    )}
  >
    <span className="text-gray-600 font-bold lg:font-medium col-span-2">
      {k}:
    </span>
    <span className="text-gray-800 col-span-4">
      {Array.isArray(val) ? (
        <div className="flex flex-col ">
          {val.reverse().map((v) => (
            <div className="flex items-center w-full ">
              <span key={v.id} className="text-lg font-semibold  ">
                {v.reading}
              </span>
              <span key={v.id} className="text-sm font-semibold text-gray-500">
                {'('} {humanizedDate(v.updatedAt)}
                {')'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <CustomEditor initialValue={val?.toString() || '-'} disabled />
      )}
    </span>
    <div className={Array.isArray(val) ? 'hidden lg:block' : 'hidden'}>
      <Divider />
    </div>
    <div className="block lg:hidden">
      <Divider />
    </div>
  </div>
);

const Diagnosis = ({
  diagnosis,
}: {
  diagnosis: CreateAssessmentRequest['diagnosis'];
}) => {
  const { data } = useOrderQuery();
  return (
    <div className="flex flex-col gap-1 lg:grid lg:grid-cols-6 lg:gap-4 py-2 lg:py-1">
      <span className="text-gray-600 font-bold lg:font-medium col-span-2">
        Diagnosis:
      </span>
      <span className="text-gray-600  col-span-4">
        {diagnosis?.map((d) => (
          <div key={d.diagnosisId} className="flex flex-col gap-1">
            <span className="text-sm font-semibold rounded-md bg-indigo-200 px-2 py-1 text-primary w-fit">
              {data?.find((o) => o.id === d.diagnosisId)?.name}
            </span>
            <span className="text-sm font-semibold rounded-md  px-2 py-1">
              <CustomEditor initialValue={d.result} disabled />
            </span>
          </div>
        ))}
      </span>
      <div className="block lg:hidden">
        <Divider />
      </div>
    </div>
  );
};

export const VisitDrawerDetails = ({
  data,
  patientId,
}: {
  data: DetailedPatientVisit;
  patientId: string;
}) => {
  const sessions = [
    {
      id: 'vitals' as const,
      title: 'Vitals',
      data: data.PatientVital,
    },
    {
      id: 'Assessment' as const,
      title: 'Assessment',
      data: data.Assessment,
    },
  ];
  const [expandedSession, setExpandedSession] = useState(
    sessions.map((s) => s.id),
  );

  const toggleSession = (id: (typeof expandedSession)[number]) => {
    setExpandedSession((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className=" bg-gray-50 h-screen shadow-lg flex flex-col overflow-auto p-4 pb-[300px]">
      {/* Header */}
      <div className="flex flex-row w-full justify-center items-center gap-1 my-6">
        <div className=" flex flex-row gap-1 items-center">
          <span className="text-sm font-semibold rounded-md bg-indigo-200 px-2 py-1 text-primary">
            {data?.Doctor?.name}
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-gray-200" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">
            {humanizedDate(data?.checkInTime)}
          </span>
        </div>
      </div>

      <div className="ml-2">
        <VisitHistory patientId={patientId} />
      </div>

      <div className="flex flex-col gap-4">
        <DrawerSession title="Vitals">
          <div className={'bg-white px-4 py-2 '}>
            <SessionText k="Height" val={data?.PatientVital?.height} />
            <SessionText k="Weight" val={data?.PatientVital?.weight} />
            <SessionText
              k="Temperature"
              val={data?.PatientVital?.temperature}
            />
            <SessionText k="Pulse" val={data?.PatientVital?.pulse} />
            <SessionText k="Bp" val={data?.PatientVital?.bp} />
            <SessionText k="Spo2" val={data?.PatientVital?.spo2} />
          </div>
        </DrawerSession>

        <DrawerSession title="Assessment">
          <div className="dbg-white px-4 py-2  flex flex-col gap-4">
            <SessionText k="Complains" val={data?.Assessment?.complaint} />
            <SessionText
              k="Current Medications"
              val={data?.Assessment?.currentMedication}
            />
            <SessionText
              k="History"
              val={data?.Assessment?.pastMedicalHistory}
            />
            <SessionText k="Examination" val={data?.Assessment?.examination} />
            <SessionText
              k="Investigation"
              val={data?.Assessment?.investigation}
            />
            <SessionText
              k="Procedure Done"
              val={data?.Assessment?.procedureDone}
            />
            <Diagnosis diagnosis={data?.Assessment?.diagnosis} />
            <SessionText
              k="Treatment Given"
              val={data?.Assessment?.treatmentGiven}
            />
            <SessionText k="Advice" val={data?.Assessment?.advice} />
            <SessionText
              k="Follow Up Date"
              val={
                data?.Assessment?.followUpDate
                  ? humanizedDate(data?.Assessment?.followUpDate)
                  : 'N/A'
              }
            />
            <SessionText
              k="Follow Up Instruction"
              val={data?.Assessment?.followupInstruction}
            />
          </div>
        </DrawerSession>

        <DrawerSession title="Prescription">
          <div className="dbg-white px-4 py-2  flex flex-col gap-4">
            <PrescriptionTable prescriptions={data.PatientPrescription} />
          </div>
        </DrawerSession>
      </div>
    </div>
  );
};
