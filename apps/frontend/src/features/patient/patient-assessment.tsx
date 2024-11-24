import { FormInput } from '../../component/form/form-input';
import { FormProvider, useForm } from 'react-hook-form';

export const PatientAssessment = () => {
  const formProvider = useForm();
  return (
    <FormProvider {...formProvider}>
      <form className="flex max-h-[90vh] flex-col gap-12">
        <div className="flex flex-col gap-2 ">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-500 border-b border-gray-900/10 pb-1">
              OP Case Sheet
            </h2>
            <div className="mt-2 border-b border-gray-900/10  sm:space-y-0 sm:pb-0">
              <div className="sm:col-span-6 sm:py-2">
                <FormInput
                  labelName="Complaints"
                  id="complaints"
                  type="text"
                  autoComplete="off"
                  twoColumn
                  inputClassName="sm:max-w-xl"
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Current Medications"
                  id="currentMedications"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="History"
                  id="history"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Examination"
                  id="examination"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Investigation"
                  id="investigation"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Procedure Done"
                  id="procedureDone"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Diagnosis"
                  id="diagnosis"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Treatment Given"
                  id="treatmentGiven"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Advice"
                  id="advice"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Follow Up Date"
                  id="followUpDate"
                  type="date"
                  autoComplete="off"
                  twoColumn
                />
              </div>
              <div className="sm:col-span-4 sm:py-2">
                <FormInput
                  labelName="Follow Up Instructions"
                  id="followUpInstructions"
                  type="text"
                  autoComplete="off"
                  twoColumn
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
