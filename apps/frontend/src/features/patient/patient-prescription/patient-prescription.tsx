import { CheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientPrescriptionRequest,
  createPatientPrescriptionSchema,
  ensure,
  Maybe,
} from '@hospital/shared';
import { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { FormAutoCompleteInput } from '../../../component/form/form-auto-complete-input';
import { FormInput } from '../../../component/form/form-input';
import PageLoading from '../../../component/page-loader';
import Tooltip, { TooltipRef } from '../../../component/tooltip';
import { TIMER_S, useTimer } from '../../../utils/use-timer';
import { useProductQuery } from '../../product/use-product-query';
import {
  usePatientPrescriptionMutation,
  usePatientVisitByIdQuery,
} from '../use-patient-visit';
import { FrequencyAdvance } from './frequency-advance';
import { ShowPrescription } from './prescription-table';

const Form = ({
  patientId,
  visitId,
  defaultValue,
}: {
  patientId: string;
  visitId: string;
  defaultValue: Maybe<CreatePatientPrescriptionRequest>;
}) => {
  type CreatePatientPrescriptionForm = CreatePatientPrescriptionRequest[number];
  const formProvider = useForm<CreatePatientPrescriptionForm>({
    resolver: zodResolver(createPatientPrescriptionSchema),
  });
  const { mutateAsync } = usePatientPrescriptionMutation();
  const [list, setList] = useState<CreatePatientPrescriptionRequest>(
    defaultValue || [],
  );
  const ref = useRef<TooltipRef>();
  const { data } = useProductQuery({
    search: formProvider.watch('medicineName'),
    paginate: {
      page: 1,
      limit: 10,
    },
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [start] = useTimer(TIMER_S);
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <FormProvider {...formProvider}>
        <form
          className=" p-4 rounded-lg"
          onSubmit={formProvider.handleSubmit((data) => {
            if (Number.isFinite(editId)) {
              formProvider.reset();
              const updateList = list.map((l, idx) => {
                if (idx === editId) {
                  return { ...data, idx };
                }
                return l;
              });
              setList(updateList);
              setEditId(null);
              return;
            }
            setList([...list, { ...data, idx: list.length }]);
            formProvider.reset();
          })}
        >
          <div className="flex flex-col-reverse gap-12 lg:flex-row">
            <div className="w-full 2xl:w-1/2 sm:w-3/4">
              <ShowPrescription
                data={list}
                setEdit={useRef((idx: number) => {
                  formProvider.clearErrors();
                  setEditId(idx);
                  setList((l) => {
                    const old = l[idx];
                    if (!old) {
                      return l;
                    }
                    Object.entries(old).map(([k, v]) =>
                      formProvider.setValue(k as any, v),
                    );
                    return l;
                  });
                })}
              />
              <div className="w-full mt-8 flex items-end justify-end">
                <button
                  className="btn-primary"
                  onClick={async (e) => {
                    e.preventDefault();
                    await mutateAsync({
                      patientId,
                      prescription: list,
                      visitId,
                    });
                    toast.success('Prescription Saved');
                    setSaved(true);
                    start(() => {
                      setSaved(false);
                    });
                  }}
                >
                  {saved ? (
                    <>
                      <CheckIcon className="w-5 h-5" width={24} />
                      Saved
                    </>
                  ) : (
                    'Create Prescription'
                  )}
                </button>
              </div>
            </div>
            <div className="w-full 2xl:w-1/2 sm:w-1/4 bg-slate-50 p-4">
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-6 2xl:col-span-4">
                  <FormAutoCompleteInput<CreatePatientPrescriptionForm>
                    id="medicineName"
                    labelName="Item Name"
                    placeholder="Paracetamol"
                    isRequired
                    options={data?.data.map((d) => ({
                      id: d.id,
                      label: d.name,
                    }))}
                    onEnter={(id) => {
                      const product = data?.data.find((d) => d.id === id);
                      if (!product) {
                        return;
                      }
                      formProvider.setValue('generic', product?.genericName);
                      formProvider.setValue('form', product?.dosageForm);
                      document.getElementById('dosage')?.focus();
                    }}
                  />
                </div>
                <div className="col-span-6 2xl:col-span-2">
                  <FormInput<CreatePatientPrescriptionForm>
                    autoComplete="off"
                    id="generic"
                    labelName="Generic"
                    type="text"
                    placeholder="Paracetamol"
                  />
                </div>
                <div className="col-span-6 2xl:col-span-2">
                  <FormInput<CreatePatientPrescriptionForm>
                    autoComplete="off"
                    id="dosage"
                    labelName="Dosage"
                    type="text"
                    placeholder="500mg"
                  />
                </div>
                <div className="col-span-6 2xl:col-span-2">
                  <div className="flex flex-col gap-1">
                    <FormInput<CreatePatientPrescriptionForm>
                      autoComplete="off"
                      id="frequency"
                      labelName="Frequency"
                      type="text"
                      placeholder="1-0-1"
                    />
                    <div className="flex flex-row gap-2">
                      {[
                        {
                          label: 'OD',
                          value: '1-0-0',
                        },
                        {
                          label: 'BD',
                          value: '1-0-1',
                        },
                        {
                          label: 'TDS',
                          value: '1-1-1',
                        },
                        {
                          label: 'HS',
                          value: '0-0-1',
                        },
                      ].map((v) => (
                        <button
                          key={v.value}
                          tabIndex={-1}
                          className="btn-text btn-small"
                          type="button"
                          onClick={() => {
                            formProvider.setValue('frequency', v.value);
                          }}
                        >
                          {v.label}
                        </button>
                      ))}
                      <div className="hidden 2xl:block">
                        <Tooltip
                          fix
                          ref={ref}
                          text={
                            <div className="p-4">
                              <FrequencyAdvance
                                onDone={() => ref.current?.stop()}
                                running={false}
                              />
                            </div>
                          }
                          stopAfter={TIMER_S}
                          bgColor="bg-gray-200 shadow-sm"
                        >
                          <p className="btn-text btn-small">
                            <Cog6ToothIcon className="h-6 w-6" />
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="block 2xl:hidden">
                      <FrequencyAdvance running />
                    </div>
                  </div>
                </div>
                <div className="col-span-3 2xl:col-span-2">
                  <FormInput<CreatePatientPrescriptionForm>
                    autoComplete="off"
                    id="duration"
                    labelName="Duration"
                    type="text"
                    placeholder="30 days"
                  />
                </div>
                <div className="col-span-3 2xl:col-span-2">
                  <FormInput<CreatePatientPrescriptionForm>
                    autoComplete="off"
                    id="form"
                    labelName="Form"
                    type="text"
                    placeholder="Tablet"
                  />
                </div>
                <div className="col-span-3 2xl:col-span-2">
                  <div className="flex flex-col gap-1">
                    <FormInput<CreatePatientPrescriptionForm>
                      autoComplete="off"
                      id="instruction"
                      labelName="Instruction"
                      type="text"
                      placeholder="Before meal"
                    />
                    <div className="flex flex-row gap-2">
                      {[
                        {
                          label: 'BF',
                          value: 'Before Food',
                        },
                        {
                          label: 'AF',
                          value: 'After Food',
                        },
                      ].map((v) => (
                        <button
                          key={v.value}
                          tabIndex={-1}
                          className="btn-text btn-small"
                          type="button"
                          onClick={() => {
                            formProvider.setValue('instruction', v.value);
                          }}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 2xl:col-span-2">
                  <FormInput<CreatePatientPrescriptionForm>
                    autoComplete="off"
                    id="quantity"
                    labelName="Quantity"
                    type="text"
                    placeholder="1"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                {editId ? (
                  <button
                    type="reset"
                    onClick={(e) => {
                      if (Number.isFinite(editId)) {
                        formProvider.clearErrors();
                        formProvider.reset();
                        e.preventDefault();
                        setList((l) => l.filter((_, idx) => idx !== editId));
                        setEditId(null);
                      }
                    }}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                ) : (
                  <>.</>
                )}
                <div className="flex flex-row-reverse gap-2">
                  <button type="submit" className="btn-primary">
                    {typeof editId === 'number' ? 'Edit' : 'Add'}
                  </button>
                  <button
                    type="reset"
                    className="btn-text "
                    onClick={(e) => {
                      formProvider.reset();
                      setEditId(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const PatientPrescription = () => {
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
    <div className="w-[100vw] sm:w-[calc(100vw-133.8px)]">
      <Form
        patientId={patientId}
        visitId={visitId}
        defaultValue={data.PatientPrescription}
      />
    </div>
  );
};
