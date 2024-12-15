import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CONSULTATION_ORDER_TAG,
  CreatePatientVisitRequest,
  createPatientVisitSchema,
  ensure,
  TokenResponse,
} from '@hospital/shared';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import { PaidBy } from '../../component/paid-by';
import { CustomSelect } from '../../component/select';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { useOrderQuery } from '../../provider/use-order';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { HttpService } from '../../utils/http';
import { useEsc } from '../../utils/use-esc';
import { useDoctorQuery } from '../employee/use-employee-query';
import { usePatientVisitMutation } from './use-patient-visit';

export const PatientVisitDrawer = ({
  defaultValues,
  departmentId,
}: {
  defaultValues?: CreatePatientVisitRequest;
  departmentId?: string;
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreatePatientVisitRequest>({
    resolver: zodResolver(createPatientVisitSchema),
    defaultValues,
  });
  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  return (
    <div className="w-[800px]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-semibold capitalize text-gray-400">
          New Patient Visit
        </h1>
        <button
          type="button"
          aria-label="Close panel"
          className="btn-text btn-text-secondary"
          onClick={() => {
            navigate('../', {
              replace: true,
            });
          }}
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
      </div>
      <FormModeProvider mode={FormMode.Editable} oldId={departmentId}>
        <FormProvider {...formProvider}>
          <form className="flex flex-col gap-12">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <DoctorSelect />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreatePatientVisitRequest>
                  isRequired
                  id="checkInTime"
                  labelName="Check In Time"
                  autoComplete="off"
                  type="datetime-local"
                  defaultValue={new Date()}
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreatePatientVisitRequest>
                  id="billing.advanceAmount"
                  labelName="Advance Amount"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-3">
                <PaidBy
                  totalAmount={formProvider.watch('billing.advanceAmount')}
                  id="billing"
                />
              </div>
              <div className="sm:col-span-3">
                <TokenWrapper />
              </div>
            </div>
            <CreateFooter />
          </form>
        </FormProvider>
      </FormModeProvider>
    </div>
  );
};

const TokenWrapper = () => {
  const [token, setToken] = useState<TokenResponse>();
  const { watch } = useFormContext<CreatePatientVisitRequest>();
  const doctorId = watch('doctorId');
  useEffect(() => {
    if (!doctorId) {
      return;
    }
    const cancelToken = axios.CancelToken.source();
    HttpService.get<TokenResponse>(`/v1/util/token/${doctorId}`, {
      cancelToken: cancelToken.token,
    }).then((res) => {
      setToken(res);
    });
    return () => {
      cancelToken.cancel();
    };
  }, [doctorId]);
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-gray-400">
        <div>Your Token: {token?.yourToken}</div>
        <div> Tokens Completed: {token?.tokensCompleted}</div>
      </p>
    </div>
  );
};

const DoctorSelect = () => {
  const [search, setSearch] = useState('');
  const { data: orders } = useOrderQuery();
  const { data } = useDoctorQuery();
  const res =
    data
      ?.filter((i) => {
        return i.name.toLowerCase().includes(search.toLowerCase());
      })
      ?.map((item) => ({
        label: item.name,
        id: item.id,
      })) ?? [];
  const { watch, setValue } = useFormContext<CreatePatientVisitRequest>();
  const consultationOrder = orders?.find((o) =>
    o.tags.includes(CONSULTATION_ORDER_TAG),
  );
  const doctorId = watch('doctorId');
  return (
    <div className="flex flex-col gap-1">
      <CustomSelect
        options={res}
        value={watch('doctorId')}
        onRawChange={(value) => {
          setSearch(value);
        }}
        labelName="Doctor Name"
        htmlFor="doctorId"
        onChange={(value) => {
          setValue('doctorId', value, {
            shouldValidate: true,
            shouldTouch: true,
            shouldDirty: true,
          });
        }}
      />
      {consultationOrder && doctorId ? (
        <p className="text-sm text-gray-400">
          <span>Consultation Fee: Rs.{consultationOrder.baseAmount}</span>
        </p>
      ) : null}
    </div>
  );
};

const CreateFooter = () => {
  const formProvider = useFormContext<CreatePatientVisitRequest>();
  const { patientId } = useParams();
  ensure(patientId, 'Patient id is required');
  const { mutateAsync } = usePatientVisitMutation({
    onError: (err) => {
      if (err instanceof Error) {
        formProvider.setError('doctorId', {
          message: err.message,
        });
      }
      formProvider.setError('doctorId', {
        message: String(err),
      });
    },
    onSuccess: (data) => {
      navigate(
        `${routerConfig.Patient}/${data.uhid}/${routerConfig.Visit}/${data.id}`,
        {
          replace: true,
        },
      );
    },
  });
  const navigate = useNavigate();
  return (
    <div className="flex mt-24 w-[95%] items-center flex-row-reverse gap-x-6">
      <button
        type={'button'}
        className={classNames(
          'btn-primary capitalize',
          formProvider.formState.isSubmitting
            ? 'cursor-not-allowed bg-red-400'
            : 'cursor-pointer',
        )}
        disabled={formProvider.formState.isSubmitting}
        onClick={async () => {
          console.log(formProvider.getValues());
          await formProvider.handleSubmit((data) => {
            return mutateAsync({ ...data, patientId });
          })();
        }}
      >
        {formProvider.formState.isSubmitting ? (
          <svg
            className="mr-3 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V2.5"
            />
          </svg>
        ) : null}
        CheckIn
      </button>
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          window.history.back();
        }}
      >
        Cancel
      </button>
    </div>
  );
};
