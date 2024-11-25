import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateAssessmentRequest,
  createAssessmentSchema,
  ensure,
  Maybe,
} from '@hospital/shared';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { CustomEditor } from '../../component/editor';
import { FormEditor } from '../../component/form/form-editor';
import { FormInput } from '../../component/form/form-input';
import PageLoading from '../../component/page-loader';
import { CustomSelect } from '../../component/select';
import { useDiagnosisQuery } from './use-diagonisis';
import {
  usePatientAssessmentMutation,
  usePatientVisitByIdQuery,
} from './use-patient-visit';
import toast from 'react-hot-toast';
import { TIMER_S, useTimer } from '../../utils/use-timer';
import { CheckIcon } from '@heroicons/react/24/outline';

const DiagnosisEditor = () => {
  const { watch, formState, setValue } =
    useFormContext<CreateAssessmentRequest>();
  const error = formState.errors['diagnosis'];
  const [search, setSearch] = useState('');
  const { data, isLoading } = useDiagnosisQuery(search, {
    limit: 10,
    page: 1,
  });
  const handleSelect = (index: number, value: string) => {
    const oldDiagnosis = watch('diagnosis') || [];
    const newDiagnosis = oldDiagnosis.map((d, i) =>
      i === index ? { ...d, diagnosisId: value } : d,
    );
    setValue('diagnosis', newDiagnosis);
  };

  const handleEditorChange = (index: number, value: string) => {
    const oldDiagnosis = watch('diagnosis') || [];
    const newDiagnosis = oldDiagnosis.map((d, i) =>
      i === index ? { ...d, result: value } : d,
    );
    setValue('diagnosis', newDiagnosis);
  };
  return (
    <div className="sm:col-span-4 sm:py-2 flex flex-col items-start gap-1">
      {error && (
        <p className="text-red-500 text-sm font-semibold">{error.message}</p>
      )}
      {watch('diagnosis')?.map((d, idx) => (
        <div className="flex gap-2 w-full " key={d.diagnosisId}>
          <CustomSelect
            labelName="Diagnosis"
            isLoading={isLoading}
            options={data?.data.map((d) => ({
              label: d.name,
              id: d.id,
            }))}
            htmlFor="diagnosis"
            value={d.diagnosisId}
            onChange={(value) => handleSelect(idx, value)}
            onRawChange={setSearch}
          />
          <div className={'w-full'}>
            <label
              htmlFor={`diageditor-${idx}`}
              className={'font-medium text-gray-700 text-base'}
            >
              Results
            </label>
            <div>
              <CustomEditor
                className={
                  'w-full border-gray-300 block sm:text-sm/6 rounded-md border disabled:bg-gray-100 bg-white'
                }
                initialValue={d.result}
                onChange={(e) => handleEditorChange(idx, e)}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-text btn-small"
            onClick={() => {
              setValue('diagnosis', [
                ...(watch('diagnosis') || []).filter((_, i) => i !== idx),
              ]);
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-primary btn-small"
        onClick={() => {
          setValue('diagnosis', [
            ...(watch('diagnosis') || []),
            {
              diagnosisId: '',
              name: '',
              result: '',
            },
          ]);
        }}
      >
        Add Diagnosis
      </button>
    </div>
  );
};

const Form = ({
  patientId,
  visitId,
  defaultValue,
}: {
  patientId: string;
  visitId: string;
  defaultValue: Maybe<Omit<CreateAssessmentRequest, 'patientId'>>;
}) => {
  const [saved, setSaved] = useState(false);
  const { mutateAsync, isPending } = usePatientAssessmentMutation();
  const [start] = useTimer(TIMER_S);
  const formProvider = useForm<CreateAssessmentRequest>({
    defaultValues: {
      ...defaultValue,
      patientId,
      visitId,
    },
    resolver: zodResolver(createAssessmentSchema),
  });
  return (
    <FormProvider {...formProvider}>
      <form
        className="flex flex-col gap-12 w-[100vw] sm:w-[70vw] px-4 py-6 bg-gray-50 rounded-lg "
        onSubmit={formProvider.handleSubmit(async (data) => {
          console.log(data);
          await mutateAsync({ ...data, patientId, visitId });
          toast.success('Assessment Saved');
          setSaved(true);
          start(() => {
            setSaved(false);
          });
        })}
      >
        <div className="flex flex-col gap-2 ">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-500 border-b border-gray-900/10 pb-1">
              OP Case Sheet
            </h2>
            <div className="mt-2  border-gray-900/10  sm:space-y-0 sm:pb-0">
              <div className="sm:col-span-6 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Complaints"
                  id="complaint"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Current Medications"
                  id="currentMedication"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="History"
                  id="pastMedicalHistory"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Examination"
                  id="examination"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Investigation"
                  id="investigation"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Procedure Done"
                  id="procedureDone"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <DiagnosisEditor />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Treatment Given"
                  id="treatmentGiven"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-4">
                <FormEditor<CreateAssessmentRequest>
                  labelName="Advice"
                  id="advice"
                  twoColumn
                />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-base/7 font-semibold text-gray-500 border-b border-gray-900/10 pb-1">
                Follow Up
              </h2>
              <div className="mt-2 border-b border-gray-900/10  sm:space-y-0 sm:pb-0 flex gap-4">
                <div className="sm:py-2">
                  <FormInput<CreateAssessmentRequest>
                    labelName="Follow Up Date"
                    id="followUpDate"
                    type="date"
                    autoComplete="off"
                  />
                </div>
                <div className="w-full sm:py-2">
                  <FormEditor<CreateAssessmentRequest>
                    labelName="Follow Up Instructions"
                    id="followupInstruction"
                    defaultValue=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="reset"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Reset
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {saved ? (
              <>
                <CheckIcon className="w-5 h-5" width={24} />
                Saved
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export const PatientAssessment = () => {
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
      defaultValue={data.Assessment}
    />
  );
};
