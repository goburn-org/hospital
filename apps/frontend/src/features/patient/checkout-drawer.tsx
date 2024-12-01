import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientBillingRequest,
  createPatientBillingSchema,
  ensure,
} from '@hospital/shared';
import { Fragment, useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { classNames } from '../../utils/classNames';
import { routerConfig } from '../../utils/constants';
import { useEsc } from '../../utils/use-esc';
import { TIMER_L, useTimer } from '../../utils/use-timer';
import {
  usePatientBillingAutoGenerateMutation,
  usePatientBillingAutoGenerateQuery,
  usePatientByIdQuery,
  usePatientVisitCheckoutMutation,
} from './use-patient-query';

export const CheckoutDrawer = ({
  defaultValues,
  mode,
}: {
  defaultValues?: CreatePatientBillingRequest;
  mode: 'create' | 'edit' | 'view';
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreatePatientBillingRequest>({
    resolver: zodResolver(createPatientBillingSchema),
    defaultValues,
  });
  const { patientId } = useParams();
  ensure(patientId, 'Patient id is required');
  const { data } = usePatientByIdQuery(patientId);
  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  const editable = mode !== 'view';
  return (
    <div className="w-[800px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start mb-2">
          <h1 className="text-2xl font-semibold capitalize text-gray-700">
            {data?.aadharName ?? data?.name}{' '}
          </h1>
          <div className="flex gap-1 items-center">
            <p className="text-gray-500">{data?.mobile}</p>
            <span className="rounded-full bg-gray-300 h-2 w-2" />
            <p className="text-gray-500">{data?.city}</p>
          </div>
        </div>
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
      <FormModeProvider
        mode={editable ? FormMode.Editable : FormMode.ReadOnly}
        oldId={patientId}
      >
        <FormProvider {...formProvider}>
          <form className="flex max-h-[90vh] flex-col ">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Items />
              </div>
              <div className="sm:col-span-5 ">
                <div className="flex justify-end w-full">
                  <PaidBy />
                </div>
              </div>
            </div>
            {mode === 'view' ? <ViewFooter /> : null}
            {mode === 'create' ? <CreateFooter /> : null}
          </form>
        </FormProvider>
      </FormModeProvider>
    </div>
  );
};

/**
 * reason and amount details
 * sub form
 * will add the reason and amount details to total amount
 */
const Items = () => {
  const { setValue, watch } = useFormContext<CreatePatientBillingRequest>();
  const items = watch('items');

  const { patientId, visitId } = useParams();
  ensure(patientId, 'Patient id is required');
  ensure(visitId, 'Visit id is required');
  const { mutateAsync } = usePatientBillingAutoGenerateMutation({
    patientId,
    visitId,
  });
  const { data } = usePatientBillingAutoGenerateQuery({
    patientId,
    visitId,
  });
  const noItem = data ? data.BillingPatientOrderLineItem.length === 0 : false;
  const alreadyPaid = data?.Receipt.reduce((acc, i) => i.paid + acc, 0);
  const totalAmount = items?.reduce((acc, i) => i.itemAmount + acc, 0);
  const toBePaid =
    items?.reduce((acc, i) => i.itemAmount + acc, 0) - (alreadyPaid || 0);
  useEffect(() => {
    if (noItem) {
      mutateAsync();
    }
  }, [mutateAsync, noItem]);
  useEffect(() => {
    if (!data) {
      return;
    }
    setTimeout(() => {
      const items = [
        ...data.BillingConsultationOrderLineItem,
        ...data.BillingPatientOrderLineItem,
      ].map((i) => ({
        itemId: `${i.id}`,
        itemAmount: i.totalAmount,
        itemName: i.order.name,
      }));
      setValue('items', items);
    }, 10);
  }, [data, setValue]);
  useEffect(() => {
    setValue('totalAmount', toBePaid);
  }, [setValue, toBePaid]);
  return (
    <div className="sm:col-span-6">
      <div className="flex flex-col items-center justify-center ">
        <div className="w-full max-w-2xl p-4 rounded-lg">
          <div className="grid grid-cols-6 gap-4 mb-4">
            {items?.map((item, index) => (
              <Fragment key={index}>
                <input
                  type="text"
                  placeholder="Item Name"
                  className="col-span-4 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  value={item.itemName}
                  onChange={(e) => {
                    const updatedItems = items?.map((i) => {
                      if (i.itemId === item.itemId) {
                        return {
                          ...item,
                          itemName: e.target.value,
                        };
                      }
                      return i;
                    });
                    setValue('items', updatedItems);
                  }}
                />
                <input
                  type="number"
                  readOnly
                  disabled
                  placeholder="Amount"
                  className="col-span-2 p-2 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  value={item.itemAmount === 0 ? '' : Number(item.itemAmount)}
                  onChange={(e) => {
                    const updatedItems = items?.map((i) => {
                      if (i.itemId === item.itemId) {
                        return {
                          ...item,
                          itemAmount: Number(e.target.value),
                        };
                      }
                      return i;
                    });
                    setValue('items', updatedItems);
                  }}
                />
              </Fragment>
            ))}
          </div>
          <div className="flex flex-col items-end w-full gap-2 px-3">
            <div className="flex gap-2">
              <p className="font-semibold text-gray-400">Total Amount</p>
              <p className="font-semibold text-black">Rs. {totalAmount}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-semibold text-gray-400">Already Paid</p>
              <p className="font-semibold text-black">Rs. {alreadyPaid}</p>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              {toBePaid ? (
                <div className="flex items-center gap-2 bg-pink-200 px-2 py-1 rounded-sm">
                  <p className="font-semibold text-pink-950">Pending</p>
                  <p className="font-semibold text-pink-950">Rs. {toBePaid}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-teal-200 px-2 py-1 rounded-sm">
                  <p className="font-semibold text-green-950">All Settled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaidBy = () => {
  const { setValue, watch } = useFormContext<CreatePatientBillingRequest>();
  const [mode, setMode] = useState<'cash' | 'card'>('cash');
  const totalAmount = watch('totalAmount');
  useEffect(() => {
    if (mode === 'cash') {
      setValue('cashAmount', 0);
      setValue('cardAmount', totalAmount);
    }
    if (mode === 'card') {
      setValue('cashAmount', totalAmount);
      setValue('cardAmount', 0);
    }
  }, [mode, setValue, totalAmount]);
  return (
    <div className="flex items-center gap-x-4 mb-12">
      <div className="flex items-center gap-x-2">
        <input
          type="radio"
          id="cash"
          name="paidBy"
          value="cash"
          checked={mode === 'cash'}
          onChange={() => {
            setMode('cash');
          }}
          className="h-5 w-5 text-primary"
        />
        <label htmlFor="cash">Cash</label>
      </div>
      <div className="flex items-center gap-x-2">
        <input
          type="radio"
          id="card"
          name="paidBy"
          value="card"
          checked={mode === 'card'}
          onChange={() => {
            setMode('card');
          }}
          className="h-5 w-5 text-primary"
        />
        <label htmlFor="card">Card</label>
      </div>
    </div>
  );
};
const ViewFooter = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="flex w-[95%] items-center justify-end gap-x-6">
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          const path = `../../${routerConfig.Patient}/${routerConfig.Edit}/${id}`;
          navigate(path, {
            replace: true,
          });
        }}
      >
        Edit
      </button>
      <button
        type="button"
        className={classNames('btn-primary')}
        onClick={() => {
          navigate('../', {
            replace: true,
          });
        }}
      >
        Close
      </button>
    </div>
  );
};

const CreateFooter = () => {
  const formProvider = useFormContext<CreatePatientBillingRequest>();
  const [show] = useTimer(TIMER_L);
  const { patientId, visitId } = useParams();
  ensure(patientId, 'Patient id is required');
  ensure(visitId, 'Visit id is required');
  const { mutateAsync, isSuccess } = usePatientVisitCheckoutMutation({
    onError: (err) => {
      if (err instanceof Error) {
        formProvider.setError('items', {
          message: err.message,
        });
      }
      formProvider.setError('items', {
        message: String(err),
      });
    },
    onSuccess: () => {
      toast.success('Successfully checked out');
      show(() => {
        navigate('..', {
          replace: true,
        });
      });
    },
  });
  const navigate = useNavigate();
  return (
    <div className="flex w-[95%] items-center justify-end gap-x-6">
      <button
        type="button"
        className="btn-text btn-text-secondary"
        onClick={() => {
          navigate('../', {
            replace: true,
          });
        }}
      >
        Cancel
      </button>
      <button
        type={'button'}
        className={classNames(
          'btn-primary capitalize',
          formProvider.formState.isSubmitting
            ? 'cursor-not-allowed'
            : 'cursor-pointer',
        )}
        disabled={formProvider.formState.isSubmitting}
        onClick={async () => {
          await formProvider.handleSubmit((data) => {
            return mutateAsync({
              ...data,
              visitId,
              patientId,
            });
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
        {isSuccess ? 'Done' : 'Make Payment'}
      </button>
    </div>
  );
};
