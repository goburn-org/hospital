import {
  humanizedDate,
  PaginatedResponse,
  PatientVisitResponse,
  Sure,
} from '@hospital/shared';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DrawerSkeleton } from '../../../component/drawer-skeleton';
import { TableLoading } from '../../../component/page-loader';
import { PatientInfoTitleDrawer } from '../../../component/patient-info-title-drawer';
import { fetchDoctorName } from '../../employee/use-employee-query';
import { usePatientByIdQuery } from '../../patient/use-patient-query';
import { usePatientVisitHistoryQuery } from '../../patient/use-patient-visit';

const Table = ({
  data,
}: {
  data?: PaginatedResponse<Sure<PatientVisitResponse>>;
}) => {
  const doctorIds = useMemo(
    () => [...new Set(data?.data.map((v) => v.doctorId) ?? [])],
    [data?.data],
  );
  const [users, setUsers] = useState<Record<string, string>>({});
  useEffect(() => {
    fetchDoctorName(doctorIds).then((res) => {
      setUsers(res);
    });
  }, [doctorIds]);
  return (
    <div className="w-full mt-9 overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border-b border-gray-300">
              Visit Date
            </th>
            <th className="text-left px-4 py-2 border-b border-gray-300">
              Consultant
            </th>
            <th className="text-left px-4 py-2 border-b border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((visit) => (
            <tr
              key={visit.id}
              className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
            >
              <td className="px-4 py-2 text-gray-700">
                {humanizedDate(visit.checkInTime)}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {users[visit.doctorId]}
              </td>
              <td className="px-4 py-2 text-gray-700">
                <Link
                  to={visit.id}
                  className="btn-small btn-text text-blue-500 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const VisitList = ({ patientId }: { patientId: string }) => {
  const { data, isLoading } = usePatientVisitHistoryQuery(patientId);
  const { data: patient } = usePatientByIdQuery(patientId);
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <DrawerSkeleton
        title={
          <PatientInfoTitleDrawer
            name={patient?.aadharName ?? patient?.name}
            city={patient?.city}
            mobile={patient?.mobile}
            onClose={() => {
              navigate('..', {
                replace: true,
              });
            }}
          />
        }
      >
        <TableLoading />
      </DrawerSkeleton>
    );
  }
  return (
    <DrawerSkeleton
      title={
        <PatientInfoTitleDrawer
          name={patient?.aadharName ?? patient?.name}
          city={patient?.city}
          mobile={patient?.mobile}
          onClose={() => {
            navigate('..', {
              replace: true,
            });
          }}
        />
      }
    >
      <Table data={data} />
    </DrawerSkeleton>
  );
};
