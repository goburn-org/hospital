import { XMarkIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
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
import { PaidBy } from '../../component/paid-by';
import { PatientInfoTitleDrawer } from '../../component/patient-info-title-drawer';
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
  usePatientBillingRemoveLineItemMutation,
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
      <PatientInfoTitleDrawer
        name={data?.aadharName ?? data?.name}
        city={data?.city}
        mobile={data?.mobile}
        onClose={() => {
          navigate('..', {
            replace: true,
          });
        }}
      />
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
                  <PaidBy totalAmount={formProvider.watch('totalAmount')} />
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
  const { mutateAsync: removeMutation } =
    usePatientBillingRemoveLineItemMutation();
  const alreadyPaid = data?.Receipt.reduce((acc, i) => i.paid + acc, 0);
  const totalAmount =
    (data?.bill
      .map((o) => o.BillingConsultationOrderLineItem)
      .flat()
      .map((i) => i.totalAmount)
      .reduce((acc, i) => i + acc, 0) ?? 0) +
    (data?.bill
      .map((o) => o.BillingPatientOrderLineItem)
      .flat()
      .filter((i) => !i.isRemoved)
      .map((i) => i.totalAmount)
      .reduce((acc, i) => i + acc, 0) ?? 0);
  const [alreadyPaidItemIds, setAlreadyPaidItemIds] = useState<string[]>([]);
  const toBePaid =
    items
      ?.filter((i) => !i.isRemoved)
      ?.reduce((acc, i) => i.itemAmount + acc, 0) - (alreadyPaid || 0);
  useEffect(() => {
    const timerId = setTimeout(() => {
      mutateAsync();
    }, 10);
    return () => {
      clearTimeout(timerId);
    };
  }, [mutateAsync]);
  useEffect(() => {
    if (!data) {
      return;
    }
    setTimeout(() => {
      const lineItems = [
        ...data.bill
          .map((o) =>
            o.BillingConsultationOrderLineItem.map((i) => ({
              ...i,
              tag: 'consultation' as const,
            })),
          )
          .flat(),
        ...data.bill
          .map((o) =>
            o.BillingPatientOrderLineItem.map((i) => ({
              ...i,
              tag: 'patient-order' as const,
            })),
          )
          .flat(),
      ].flat();
      const items = lineItems.map((i) => {
        return {
          itemId: `${i.id}`,
          itemAmount: i.totalAmount,
          itemName: i.order.name,
          billId: i.billId,
          isRemoved: i.isRemoved,
        };
      });
      const paidBillReceipts = data.Receipt.filter((r) => r.billId);
      const alreadyPaidItemIds = lineItems
        .filter((i) => paidBillReceipts.find((r) => r.billId === i.billId))
        .map((i) => `${i.id}`);
      setAlreadyPaidItemIds(alreadyPaidItemIds);
      const nonPaidBill = lineItems.filter(
        (i) =>
          !paidBillReceipts.find((r) => r.billId === i.billId) &&
          i.tag === 'patient-order',
      );
      setValue('items', items);
      setValue('billId', nonPaidBill[0]?.billId);
    }, 10);
  }, [data, setValue]);
  const completedItems =
    items
      ?.filter((i) => alreadyPaidItemIds.includes(i.itemId))
      .sort((a, b) => a.itemId.localeCompare(b.itemId)) ?? [];
  const nonCompletedItems =
    items
      ?.filter((i) => !alreadyPaidItemIds.includes(i.itemId))
      .sort((a, b) => a.itemId.localeCompare(b.itemId)) ?? [];
  useEffect(() => {
    setValue('totalAmount', toBePaid);
  }, [setValue, toBePaid]);
  return (
    <div className="sm:col-span-6">
      <div className="flex flex-col items-center justify-center ">
        <div className="w-full max-w-2xl p-4 rounded-lg">
          <div className="grid grid-cols-6 gap-4 mb-4">
            {[...completedItems, ...nonCompletedItems]?.map((item, index) => (
              <Fragment key={index}>
                <input
                  type="text"
                  disabled={alreadyPaidItemIds.includes(item.itemId)}
                  readOnly={alreadyPaidItemIds.includes(item.itemId)}
                  placeholder="Item Name"
                  className={classNames(
                    item.isRemoved ? ' text-gray-400' : '',
                    'col-span-4 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300',
                  )}
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
                <div className="col-span-2 flex flex-row gap-1">
                  {!item.isRemoved ? (
                    <input
                      type="number"
                      readOnly
                      disabled
                      placeholder="Amount"
                      className="p-2 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      value={
                        item.itemAmount === 0 ? '' : Number(item.itemAmount)
                      }
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
                  ) : (
                    <p className="p-2 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-[200px]">
                      Canceled
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn-outline btn-small"
                    // disabled={alreadyPaidItemIds.includes(item.itemId)}
                    onClick={(e) => {
                      e.preventDefault();
                      removeMutation({
                        lineItemId: item.itemId,
                        visitId,
                        patientId,
                        isRemoved: !item.isRemoved,
                      });
                    }}
                  >
                    {item.isRemoved ? (
                      <PlusIcon className="h-5 w-5" />
                    ) : (
                      <XMarkIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
              {toBePaid < 0 ? (
                <div className="flex items-center gap-2 bg-orange-200 px-2 py-1 rounded-sm">
                  <p className="font-semibold text-orange-950">Refund</p>
                  <p className="font-semibold text-orange-950">
                    Rs. {-1 * toBePaid}
                  </p>
                </div>
              ) : toBePaid ? (
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
  const amount = formProvider.watch('totalAmount');
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
      {!amount ? (
        <button
          type={'button'}
          className="btn-primary"
          onClick={async () => {
            navigate('..', {
              replace: true,
            });
          }}
        >
          Close
        </button>
      ) : (
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
      )}
    </div>
  );
};
