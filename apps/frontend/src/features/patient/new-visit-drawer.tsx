import { zodResolver } from '@hookform/resolvers/zod';
import {
  AvailableOrder,
  computeFinalPrice,
  CONSULTATION_ORDER_TAG,
  CreatePatientVisitRequest,
  createPatientVisitSchema,
  ensure,
  Maybe,
  OrderTokenResponse,
  TaxCodeResponse,
  TokenResponse,
} from '@hospital/shared';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import { PaidBy } from '../../component/paid-by';
import { PatientInfoTitleDrawer } from '../../component/patient-info-title-drawer';
import { Rupees } from '../../component/rupees';
import { CustomSelect } from '../../component/select';
import Tooltip from '../../component/tooltip';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { useOrderQuery } from '../../provider/use-order';
import { useTaxCode } from '../../provider/use-tax-code';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { HttpService } from '../../utils/http';
import { useEsc } from '../../utils/use-esc';
import { useDoctorQuery } from '../employee/use-employee-query';
import { usePatientByIdQuery } from './use-patient-query';
import {
  usePatientVisitMutation,
  usePatientVisitUpdateMutation,
} from './use-patient-visit';

export const PatientVisitDrawer = ({
  defaultValues,
  visitId,
}: {
  defaultValues?: CreatePatientVisitRequest;
  visitId?: string;
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreatePatientVisitRequest>({
    resolver: zodResolver(createPatientVisitSchema),
    defaultValues,
  });
  const { patientId } = useParams();
  ensure(patientId, 'Patient id is required');
  const { data: patient } = usePatientByIdQuery(patientId);
  useEsc(() => {
    navigate(routerConfig.Patient, {
      replace: true,
    });
  });
  return (
    <div className="w-[800px]">
      <PatientInfoTitleDrawer
        name={patient?.aadharName ?? patient?.name}
        city={patient?.area}
        mobile={patient?.mobile}
        onClose={() => {
          navigate(routerConfig.Patient, {
            replace: true,
          });
        }}
      />
      <FormModeProvider mode={FormMode.Editable} oldId={visitId}>
        <FormProvider {...formProvider}>
          <form className="flex flex-col gap-12">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormInput<CreatePatientVisitRequest>
                  isRequired
                  id="guardianName"
                  labelName="Guardian Name"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-3">
                <FormInput<CreatePatientVisitRequest>
                  isRequired
                  id="guardianMobile"
                  labelName="Guardian Mobile"
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-6">
                <OrderSelection />
              </div>
              <div className="sm:col-span-3">
                <AdvancedAmount />
              </div>
              <div className="sm:col-span-3">
                <PaidBy
                  totalAmount={formProvider.watch('billing.advanceAmount')}
                  id="billing"
                />
              </div>
            </div>
            {!visitId ? <CreateFooter /> : <EditFooter />}
          </form>
        </FormProvider>
      </FormModeProvider>
    </div>
  );
};

const AdvancedAmount = () => {
  const { watch } = useFormContext<CreatePatientVisitRequest>();
  const { data } = useOrderQuery();
  const { data: taxCode } = useTaxCode();
  const formOrders = watch('orders') || [];
  const orders = formOrders.map((o) => data?.find((d) => d.id === o.orderId));
  const total = orders.reduce(
    (acc, o) => acc + getPrice(o?.id || '', data, taxCode),
    0,
  );
  return (
    <div className="flex flex-col">
      <FormInput<CreatePatientVisitRequest>
        id="billing.advanceAmount"
        labelName="Advance Amount"
        autoComplete="off"
        type="number"
      />
      <span className="text-gray-400">
        Total Price: <Rupees amount={total} />
      </span>
    </div>
  );
};

const TokenWrapper = ({
  idx,
  isConsultantRequired,
}: {
  idx: number;
  isConsultantRequired: boolean;
}) => {
  const [token, setToken] = useState<TokenResponse>();
  const [fetching, setFetching] = useState(true);
  const { watch } = useFormContext<CreatePatientVisitRequest>();
  const orders = watch('orders') || [];
  const order = orders[idx];
  const { doctorId, orderId } = order || {};
  useEffect(() => {
    setFetching(true);
    if (doctorId) {
      const cancelToken = axios.CancelToken.source();
      HttpService.get<TokenResponse>(`/v1/util/token/${doctorId}`, {
        cancelToken: cancelToken.token,
      })
        .then((res) => {
          setToken(res);
        })
        .finally(() => {
          setFetching(false);
        });
      return () => {
        cancelToken.cancel();
      };
    } else if (orderId && !isConsultantRequired) {
      console.log('test');
      const cancelToken = axios.CancelToken.source();
      HttpService.get<OrderTokenResponse>(`/v1/util/order/token/${orderId}`, {
        cancelToken: cancelToken.token,
      })
        .then((res) => {
          setToken({
            tokensCompleted: res.total,
            yourToken: res.completed + 1,
          });
        })
        .finally(() => {
          setFetching(false);
        });
      return () => {
        cancelToken.cancel();
      };
    }
  }, [doctorId, isConsultantRequired, orderId]);
  if (fetching) {
    return null;
  }
  return (
    <Tooltip
      fix
      text={
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-400">
            <div>Your Token: {token?.yourToken}</div>
            <div> Tokens Completed: {token?.tokensCompleted}</div>
          </p>
        </div>
      }
    >
      <span className="text-gray-400">
        Token {token?.yourToken}/{token?.tokensCompleted}
      </span>
    </Tooltip>
  );
};

const getPrice = (
  orderId: string,
  orders: Maybe<AvailableOrder[]>,
  taxes: Maybe<TaxCodeResponse[]>,
) => {
  const order = orders?.find((o) => o.id === orderId);
  const tax = taxes?.find((t) => t.id === order?.taxCodeId);
  if (!order || !tax) {
    return 0;
  }
  return computeFinalPrice(order.baseAmount, tax);
};

const OrderSelection = () => {
  const { data, isLoading } = useOrderQuery();
  const { data: taxCode } = useTaxCode();
  const { data: doctor } = useDoctorQuery();
  const res =
    data?.map((item) => ({
      label: item.name,
      id: item.id,
    })) ?? [];
  const { watch, setValue } = useFormContext<CreatePatientVisitRequest>();
  const orders = watch('orders') || [];
  const consultationOrderIds = data?.find((o) =>
    o.tags.includes(CONSULTATION_ORDER_TAG),
  )?.id;
  useEffect(() => {
    if (orders.length === 0 && !isLoading) {
      setValue('orders', [
        {
          orderId: consultationOrderIds || '',
          doctorId: '',
        },
      ]);
    }
  }, [consultationOrderIds, isLoading, orders.length, setValue]);
  const isConsultantRequired = (orderId: string) =>
    data?.find((o) => o.id === orderId)?.consultationRequired;
  return (
    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
      {orders.map((o, idx) => (
        <Fragment key={idx}>
          <div className="sm:col-span-3">
            <div className="flex flex-col">
              <CustomSelect
                options={res}
                value={o.orderId}
                labelName="Order Name"
                htmlFor={`orders.${idx}.orderId`}
                onChange={(value) => {
                  setValue(`orders.${idx}.orderId`, value, {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-400">
                  Price: <Rupees amount={getPrice(o.orderId, data, taxCode)} />
                </span>
                <TokenWrapper
                  idx={idx}
                  isConsultantRequired={
                    isConsultantRequired(o.orderId) || false
                  }
                />
              </div>
              <button
                type="button"
                className="btn-small !text-red-500"
                onClick={() => {
                  setValue(
                    'orders',
                    orders.filter((_, i) => i !== idx),
                  );
                }}
              >
                Remove Order
              </button>
            </div>
          </div>
          <div className="sm:col-span-3">
            {isConsultantRequired(o.orderId) ? (
              <CustomSelect
                options={doctor?.map((d) => ({
                  label: d.name,
                  id: d.id,
                }))}
                value={o.doctorId}
                labelName="Consultant Name"
                htmlFor={`orders.${idx}.doctorId`}
                onChange={(value) => {
                  setValue(`orders.${idx}.doctorId`, value, {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
              />
            ) : null}
          </div>
        </Fragment>
      ))}
      <div className="sm:col-span-3">
        <button
          type="button"
          className="btn-text !p-0"
          onClick={() => {
            setValue('orders', [
              ...orders,
              {
                orderId: '',
                doctorId: '',
              },
            ]);
          }}
        >
          Add Order
        </button>
      </div>
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
        formProvider.setError('guardianName', {
          message: err.message,
        });
      }
      formProvider.setError('guardianName', {
        message: String(err),
      });
    },
    onSuccess: (data) => {
      navigate(routerConfig.Patient, {
        replace: true,
      });
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
          console.log(formProvider.formState.errors);
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
        Create Order
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

const EditFooter = () => {
  const formProvider = useFormContext<CreatePatientVisitRequest>();
  const { patientId, visitId } = useParams();
  ensure(patientId, 'Patient id is required');
  ensure(visitId, 'visitId is required');
  const { mutateAsync } = usePatientVisitUpdateMutation({
    onError: (err) => {
      if (err instanceof Error) {
        formProvider.setError('guardianName', {
          message: err.message,
        });
      }
      formProvider.setError('guardianName', {
        message: String(err),
      });
    },
    onSuccess: (data) => {
      navigate(routerConfig.Patient, {
        replace: true,
      });
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
          console.log(formProvider.formState.errors);
          await formProvider.handleSubmit((data) => {
            return mutateAsync({ ...data, patientId, visitId });
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
        Edit Order
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
