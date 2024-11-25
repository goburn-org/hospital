import { ensure } from '@hospital/shared';
import { Outlet, useParams } from 'react-router-dom';
import Breadcrumbs from '../../component/breadcrumbs';
import { usePatientByIdQuery } from '../../features/patient/use-patient-query';
import { routerConfig } from '../../utils/constants';
import { Tabs } from '../../component/page-tabs';
import { useState } from 'react';
import { PatientAssessment } from '../../features/patient/patient-assessment';
import { PatientOrder } from '../../features/patient/patient-order';

const tabs = [
  'Assessment',
  'Orders',
  'Prescription',
  'Documents',
  'Past Records',
] as const;

export const Component = () => {
  const { patientId } = useParams();
  ensure(patientId, 'id is required');
  const { data, isLoading } = usePatientByIdQuery(patientId);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>('Assessment');
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
    <div className="flex flex-col gap-8 -mt-6 sm:px-6">
      <div className="">
        <Breadcrumbs pages={breadcrumbsPages} />
        <div className="mt-2">
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
        <div className="-my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {activeTab === 'Assessment' && <PatientAssessment />}
            {activeTab === 'Orders' && <PatientOrder />}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
