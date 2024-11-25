import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientPrescriptionRequest,
  createPatientPrescriptionSchema,
  ensure,
  Maybe,
} from '@hospital/shared';
import { MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { MutableRefObject, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import PageLoading from '../../component/page-loader';
import { CustomTable } from '../../component/table';
import { TIMER_S, useTimer } from '../../utils/use-timer';
import {
  usePatientPrescriptionMutation,
  usePatientVisitByIdQuery,
} from './use-patient-visit';

const ShowPrescription = ({
  data,
  setEdit,
}: {
  data: CreatePatientPrescriptionRequest;
  setEdit: MutableRefObject<(idx: number) => void>;
}) => {
  const columns = useMemo<
    MRT_ColumnDef<CreatePatientPrescriptionRequest[number]>[]
  >(
    () => [
      {
        accessorKey: 'medicineName',
        header: 'Drug',
      },
      {
        accessorKey: 'generic',
        header: 'Generic',
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
      },
      {
        accessorKey: 'dosage',
        header: 'Dosage',
      },
      {
        accessorKey: 'instruction',
        header: 'Instruction',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
      },
      {
        accessorKey: 'form',
        header: 'Form',
      },
      {
        id: 'action',
        header: 'Action',
        Cell: ({ row }) => {
          return (
            <button
              onClick={(e) => {
                e.preventDefault();
                setEdit.current(row.original.idx);
              }}
              className="btn-text-tertiary btn-small"
            >
              <PencilIcon className="w-5 h-5" width={12} />
            </button>
          );
        },
      },
    ],
    [setEdit],
    //end
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: { showColumnFilters: true },
    rowCount: data.length,
    state: {
      isLoading: false,
    },
  });
  return <CustomTable table={table} menu={[]} />;
};

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
  const [editId, setEditId] = useState<number | null>(null);
  const [start] = useTimer(TIMER_S);
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <FormProvider {...formProvider}>
        <form
          className="bg-slate-50 p-4 rounded-lg"
          onSubmit={formProvider.handleSubmit((data) => {
            formProvider.reset();
            if (Number.isFinite(editId)) {
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
          })}
        >
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="medicineName"
                labelName="Item Name"
                type="text"
                placeholder="Paracetamol"
                isRequired
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="generic"
                labelName="Generic"
                type="text"
                placeholder="Paracetamol"
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="dosage"
                labelName="Dosage"
                type="text"
                placeholder="500mg"
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="frequency"
                labelName="Frequency"
                type="text"
                placeholder="1-0-1"
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="duration"
                labelName="Duration"
                type="text"
                placeholder="30 days"
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="form"
                labelName="Form"
                type="text"
                placeholder="Tablet"
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="instruction"
                labelName="Instruction"
                type="text"
                placeholder="Before meal"
              />
            </div>
            <div className="sm:col-span-2">
              <FormInput<CreatePatientPrescriptionForm>
                autoComplete="off"
                id="quantity"
                labelName="Quantity"
                type="text"
                placeholder="1"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 p-4">
            <button type="reset" className="btn-text">
              clear
            </button>
            <button type="submit" className="btn-primary">
              Add
            </button>
          </div>
        </form>
      </FormProvider>
      <div className="flex items-end">
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
      {
        <div>
          <h2 className="text-xl font-bold">Prescription List</h2>
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
        </div>
      }
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
    <Form
      patientId={patientId}
      visitId={visitId}
      defaultValue={data.PatientPrescription}
    />
  );
};
