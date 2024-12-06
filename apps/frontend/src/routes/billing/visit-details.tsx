import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { ensure } from '@hospital/shared';
import { useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { Body } from '../../component/body';
import Breadcrumbs from '../../component/breadcrumbs';
import { Tabs } from '../../component/page-tabs';
import { PatientAssessment } from '../../features/patient/patient-assessment';
import { PatientOrder } from '../../features/patient/patient-order';
import { PatientPrescription } from '../../features/patient/patient-prescription/patient-prescription';
import { PatientVitals } from '../../features/patient/patient-vitals';
import { usePatientByIdQuery } from '../../features/patient/use-patient-query';
import { VisitHistory } from '../../features/patient/visit-history';
import { routerConfig } from '../../utils/constants';

const tabs = [
  'Vitals',
  'Assessment',
  'Orders',
  'Prescription',
  'Documents',
] as const;

export const Component = () => {
  const { patientId, visitId } = useParams();
  ensure(patientId, 'id is required');
  ensure(visitId, 'id is required');

  const { data, isLoading } = usePatientByIdQuery(patientId);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Patient not found</div>;
  }
  const breadcrumbsPages = [
    { name: 'Patient', href: routerConfig.Patient },
    {
      name: data.name,
      href: `${routerConfig.Patient}/${patientId}`,
      current: true,
    },
  ];
  return (
    <Body>
      <div className="flex flex-col gap-4 -mt-6 sm:px-6">
        <div className="">
          <div className="flex justify-between">
            <Breadcrumbs pages={breadcrumbsPages} />
            <Link className="btn-primary" to={`${routerConfig.Patient}`}>
              Back
              <ArrowLeftCircleIcon width={24} className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-2 ">
            <Tabs
              defaultTab={activeTab}
              tabs={tabs.map((tab) => ({
                onClick: () => setActiveTab(tab),
                active: tab === activeTab,
                name: tab,
              }))}
            />
          </div>
        </div>
        <div className="mt-1 flow-root">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block py-2 align-middle sm:px-6 lg:px-8 ">
              <VisitHistory patientId={patientId} />
              {activeTab === 'Vitals' && <PatientVitals />}
              {activeTab === 'Assessment' && <PatientAssessment />}
              {activeTab === 'Orders' && <PatientOrder />}
              {activeTab === 'Prescription' && <PatientPrescription />}
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </Body>
  );
};
