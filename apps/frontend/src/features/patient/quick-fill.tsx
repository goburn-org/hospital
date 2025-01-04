import { CheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateAssessmentRequest,
  createAssessmentSchema,
  Maybe,
} from '@hospital/shared';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FormEditor } from '../../component/form/form-editor';
import { FormInput } from '../../component/form/form-input';
import { TIMER_S, useTimer } from '../../utils/use-timer';
import { PatientPrescription } from './patient-prescription/patient-prescription';
import { usePatientAssessmentMutation } from './use-patient-visit';

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
  const [templates, setTemplates] = useState<{ name: string; value: string }[]>(
    [],
  );
  const [complaintValue, setComplaintValue] = useState('');

  const formProvider = useForm<CreateAssessmentRequest>({
    defaultValues: {
      ...defaultValue,
      patientId,
      visitId,
    },
    resolver: zodResolver(createAssessmentSchema),
  });

  const onSubmit = async (data: CreateAssessmentRequest) => {
    console.log(data);
    await mutateAsync({ ...data, patientId, visitId });
    toast.success('Assessment Saved');
    setSaved(true);
    start(() => {
      setSaved(false);
    });
  };

  const handleAddTemplate = () => {
    const templateName = prompt('Enter a name for this template:');
    if (!templateName) {
      toast.error('Template name cannot be empty.');
      return;
    }
    if (!complaintValue.trim()) {
      toast.success(`Template saved as "${templateName}"`);
      return;
    }

    setTemplates((prev) => [
      ...prev,
      { name: templateName, value: complaintValue },
    ]);
    toast.success(`Template saved as "${templateName}"`);
  };

  const handleTemplateSelection = (templateValue: string) => {
    // Clean template value by removing prefix
    const symptomValue = templateValue.replace(/^\.\w+\s*/, '');

    setComplaintValue((prevValue) => {
      const updatedValue = prevValue
        ? `${prevValue}, ${symptomValue}` // Append the cleaned value
        : symptomValue;

      // Ensure the final value has no duplicates or extra spaces
      return updatedValue
        .split(',') // Split into individual complaints
        .map((item) => item.trim()) // Trim spaces
        .filter((item, index, arr) => item && arr.indexOf(item) === index) // Remove duplicates
        .join(', '); // Rejoin into a single string
    });
  };

  return (
    <FormProvider {...formProvider}>
      <form
        className="flex flex-col gap-12 px-4 py-6 bg-gray-50 rounded-lg"
        onSubmit={formProvider.handleSubmit(onSubmit)}
      >
        <div className="mt-2 border-gray-900/10 sm:space-y-0 sm:pb-0">
          <div className="sm:col-span-6 sm:py-2 relative">
            <FormEditor<CreateAssessmentRequest>
              labelName="Complaints"
              id="complaint"
              twoColumn
            />

            <Cog6ToothIcon
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer w-6 h-6"
              onClick={handleAddTemplate}
            />
          </div>
          {/* Template dropdown */}
          {templates.map((template, index) => (
            <button
              key={index}
              type="button"
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => handleTemplateSelection(template.value)} // Call template selection
            >
              {template.value.replace(/^\.\w+\s*/, '')}{' '}
              {/* Display cleaned value */}
            </button>
          ))}
        </div>
      </form>
      <PatientPrescription />
      <div className="mt-4">
        <h2 className="text-base/7 font-semibold text-gray-500 border-b border-gray-900/10 pb-1">
          Follow Up
        </h2>
        <div className="mt-2 border-b border-gray-900/10 sm:space-y-0 sm:pb-0 flex gap-4">
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
      <div className="mt-6 flex items-center flex-row-reverse gap-x-6">
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
        <button type="reset" className="text-sm/6 font-semibold text-gray-900">
          Reset
        </button>
      </div>
    </FormProvider>
  );
};

export default Form;
