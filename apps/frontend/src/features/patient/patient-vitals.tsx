import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientVitalRequest,
  createPatientVitalSchema,
  ensure,
  Maybe,
} from '@hospital/shared';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import PageLoading from '../../component/page-loader';
import {
  usePatientVisitByIdQuery,
  usePatientVitalMutation,
} from './use-patient-visit';

const Form = ({
  patientId,
  visitId,
  defaultValue,
}: {
  patientId: string;
  visitId: string;
  defaultValue: Maybe<CreatePatientVitalRequest>;
}) => {
  const formProvider = useForm<CreatePatientVitalRequest>({
    defaultValues: defaultValue || undefined,
    resolver: zodResolver(createPatientVitalSchema),
  });
  const { mutateAsync } = usePatientVitalMutation();
  return (
    <FormProvider {...formProvider}>
      <form
        className="bg-slate-50 p-4 rounded-lg"
        onSubmit={formProvider.handleSubmit((data) => {
          mutateAsync({ patientId, visitId, ...data });
        })}
      >
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <FormInput<CreatePatientVitalRequest>
              autoComplete="off"
              id="height"
              labelName="Height"
              type="number"
              placeholder="180"
            />
          </div>
          <div className="sm:col-span-2">
            <FormInput<CreatePatientVitalRequest>
              autoComplete="off"
              id="weight"
              labelName="Weight"
              type="number"
              placeholder="70"
            />
          </div>
          <div className="sm:col-span-2">
            <FormInput<CreatePatientVitalRequest>
              autoComplete="off"
              id="temperature"
              labelName="Temperature"
              type="number"
              placeholder="96.8"
            />
          </div>
          <div className="sm:col-span-2">
            <FormInput<CreatePatientVitalRequest>
              autoComplete="off"
              id="pulse"
              labelName="Pulse"
              type="number"
              placeholder="70"
            />
          </div>
          <div className="sm:col-span-2">
            <FormInput<CreatePatientVitalRequest>
              autoComplete="off"
              id="spo2"
              labelName="SpO2"
              type="number"
              placeholder="98"
            />
          </div>
          <div className="sm:col-span-2">
            <FormInput<CreatePatientVitalRequest>
              autoComplete="off"
              id="bp"
              labelName="BP"
              placeholder="120/80"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 p-4">
          <button type="reset" className="btn-text">
            clear
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export const PatientVitals = () => {
  const { patientId, visitId } = useParams();
  ensure(patientId, 'patientId is required');
  ensure(visitId, 'visitId is required');
  const { data, isLoading } = usePatientVisitByIdQuery({ patientId, visitId });
  if (isLoading) {
    return <PageLoading />;
  }
  if (!data) {
    return <div>Visit Not not found</div>;
  }
  return (
    <Form
      patientId={patientId}
      visitId={visitId}
      defaultValue={data.PatientVital}
    />
  );
};
