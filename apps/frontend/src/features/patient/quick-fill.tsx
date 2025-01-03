import { CheckIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateAssessmentRequest,
  createAssessmentSchema,
  Maybe,
} from '@hospital/shared';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaCog } from 'react-icons/fa'; // Import gear icon from react-icons
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
  const [start] = useTimer(TIMER_S); // Ensure TIMER_S is defined in your code
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
    const templateName = prompt('Enter a name for this template:'); // Ask user for template name
    if (!templateName) {
      toast.error('Template name cannot be empty.');
      return;
    }

    // Save the template with its name and complaint value
    setTemplates((prev) => [
      ...prev,
      { name: templateName, value: complaintValue },
    ]);
    toast.success(`Template saved as "${templateName}"`);
  };

  const handleTemplateSelection = (templateValue: string) => {
    setComplaintValue(templateValue);
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComplaintValue(e.target.value);
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
              value={complaintValue}
              onChange={handleComplaintChange} // Controlled input
            />
            {/* Gear Icon */}
            <FaCog
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              size={17}
              onClick={handleAddTemplate}
            />
          </div>
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
