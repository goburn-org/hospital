import { XMarkIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CounterSaleAvailabilityInput,
  CounterSaleAvailabilityLineItemInput,
  counterSaleAvailabilityLineItemInput,
  CounterSaleBillPayment,
  CounterSaleLineItem,
  StockAvailabilityResponse,
} from '@hospital/shared';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../component/form/form-input';
import { FormTab, FormTabs } from '../../component/form/form-tabs';
import { PaidBy } from '../../component/paid-by';
import { CustomSelect } from '../../component/select';
import { classNames } from '../../utils/classNames';
import { HttpService } from '../../utils/http';
import { useEsc } from '../../utils/use-esc';
import { useAllVisitLast24Hours } from '../patient/use-patient-visit';
import { useProductQuery } from '../product/use-product-query';
import { usePatientPrescriptionMutation } from './use-pharmacy-query';

export const CounterSaleDrawer = ({
  defaultValues,
  mode,
}: {
  defaultValues?: CounterSaleLineItem[];
  mode: 'create' | 'edit' | 'view';
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CounterSaleAvailabilityLineItemInput>({
    resolver: zodResolver(counterSaleAvailabilityLineItemInput),
  });
  const { mutateAsync } = usePatientPrescriptionMutation();
  const [visitDetails, setVisitDetails] = useState<{
    visitId: string;
    customerName: string;
  }>();
  const [productSearch, setProductSearch] = useState('');
  const { data } = useProductQuery({
    search: productSearch,
    paginate: {
      limit: 10,
      page: 1,
    },
  });
  const [tabs, setTabs] = useState<FormTab[]>([
    {
      name: 'Visit' as const,
      current: true,
      completed: !!visitDetails,
      inProgress: true,
    },
    {
      name: 'Counter Sale' as const,
      current: false,
      completed: formProvider.formState.isSubmitted,
      inProgress: false,
    },
  ]);
  const [items, setItems] = useState<CounterSaleLineItem[]>(
    defaultValues || [],
  );
  useEffect(() => {
    if (defaultValues) {
      setTabs((t) =>
        t.map((t) => ({
          ...t,
          completed: true,
          current: t.name !== 'Visit',
        })),
      );
      setItems(defaultValues);
    }
  }, [defaultValues]);

  const activeIndex = tabs.findIndex((tab) => tab.current);
  const setCurrentTab = async (tab: FormTab) => {
    setTabs((t) =>
      t.map((t) => ({
        ...t,
        current: t.name === tab.name,
        completed: t.name === 'Visit' ? true : t.completed,
      })),
    );
  };
  const findAvailableStock = async (items: CounterSaleAvailabilityInput) => {
    const res = await HttpService.post<StockAvailabilityResponse>(
      '/v1/pharmacy/availability',
      {
        items: items,
      },
    );
    const itemList: CounterSaleLineItem[] = [];
    res.availableStock.forEach((stock) =>
      stock.sku.forEach((s) => {
        itemList.push({
          productId: stock.productId,
          quantity: s.quantity,
          batchNumber: s.batchNumber,
          availableQuantity: s.quantity,
          status: 'available',
          productName:
            res.products.find((p) => p.id === stock.productId)?.name ?? '',
        });
      }),
    );
    res.unAvailableStock.forEach((stock) =>
      itemList.push({
        productId: stock.productId,
        quantity: stock.quantity,
        availableQuantity: stock.availableStock,
        status: 'unavailable',
        productName:
          res.products.find((p) => p.id === stock.productId)?.name ?? '',
      }),
    );
    setItems((i) => [...i, ...itemList]);
  };

  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  return (
    <div className="w-[800px]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-semibold capitalize text-gray-400">
          {mode} Bill
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
      <FormTabs tabs={tabs} setCurrentTab={setCurrentTab} />
      {activeIndex === 0 ? (
        <Table
          setSelected={async ({ items, customerName, visitId }) => {
            setVisitDetails({
              visitId,
              customerName,
            });
            console.log(items);
            await findAvailableStock(items);
            setCurrentTab(tabs[1]);
          }}
        />
      ) : (
        <FormProvider {...formProvider}>
          <form
            className="flex max-h-[90vh] flex-col"
            onSubmit={formProvider.handleSubmit(async (p) => {
              await findAvailableStock([p]);
              formProvider.reset();
            })}
          >
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <CustomSelect
                  isRequired
                  htmlFor="productName"
                  labelName="Product Name"
                  options={data?.data.map((d) => ({
                    label: d.name,
                    id: d.id,
                  }))}
                  onChange={(value) => {
                    formProvider.setValue('productId', value);
                  }}
                  value={formProvider.watch('productId')}
                  buttonClassName="py-3"
                  onRawChange={(e) => {
                    setProductSearch(e);
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CounterSaleAvailabilityLineItemInput>
                  isRequired
                  id="quantity"
                  labelName="Quantity"
                  placeholder=" 20"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2 flex items-end">
                <button type="submit" className="btn-text btn-text-small">
                  Add
                </button>
              </div>
            </div>
            <PrescriptionTable
              items={items}
              onDelete={(id) => {
                setItems((i) => i.filter((item) => item.productId !== id));
              }}
            />
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <FormInput<CounterSaleBillPayment>
                  isRequired
                  id="paid"
                  labelName="Paid Amount"
                  placeholder=" 20"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <PaidBy totalAmount={200} />
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  const res = await mutateAsync({
                    items: items
                      .filter((i) => 'batchNumber' in i)
                      .map((i) => ({
                        productId: i.productId,
                        saleQuantity: i.availableQuantity,
                        batchNumber: i.batchNumber,
                      })),
                    cardAmount: [],
                    customerName: visitDetails?.customerName ?? '',
                    patientVisitId: visitDetails?.visitId ?? '',
                    cashAmount: 100,
                  });
                  console.log(res);
                  toast.success('GRN created successfully');
                  // navigate('../', {
                  //   replace: true,
                  // });
                }}
                className="btn-primary"
              >
                Create Bill
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

const PrescriptionTable = ({
  items,
  onDelete,
}: {
  items: CounterSaleLineItem[];
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="mt-10">
      {items.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2 w-1">BatchNo</th>
              <th className="border border-gray-300 px-4 py-2 w-1">Quantity</th>
              <th className="border border-gray-300 px-4 py-2 w-1"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td
                  className={classNames(
                    'border border-gray-300 px-4 py-2',
                    item.status === 'unavailable' ? 'text-red-500' : '',
                  )}
                >
                  {item.productName}
                </td>
                <td
                  className={classNames(
                    'border border-gray-300 px-4 py-2',
                    item.status === 'unavailable' ? 'text-red-500' : '',
                  )}
                >
                  {item.status === 'available' ? item.batchNumber : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  {item.quantity}
                  {item.availableQuantity !== item.quantity && (
                    <span className="text-red-500 text-sm">
                      ({item.availableQuantity} available)
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => onDelete(item.productId)}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No items added yet.</p>
      )}
    </div>
  );
};

const Table = ({
  setSelected,
}: {
  setSelected: ({
    items,
    visitId,
    customerName,
  }: {
    items: CounterSaleAvailabilityInput;
    visitId: string;
    customerName: string;
  }) => void;
}) => {
  const { data } = useAllVisitLast24Hours();
  if (data === undefined) return null;
  const onSelection = async (visitId: string) => {
    const visit = data.find((d) => d.id === visitId);
    const items = visit?.PatientPrescription?.list?.map((p) => ({
      productId: p.medicineId,
      quantity: 1,
    }));
    if (items) {
      setSelected({
        visitId,
        items,
        customerName: visit?.Patient.name ?? '',
      });
    }
  };
  return (
    <div className="mt-10">
      {data?.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">UHID</th>
              <th className="border border-gray-300 px-4 py-2">
                Mobile Number
              </th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                <td
                  className="border border-gray-300 px-4 py-2"
                  onClick={() => onSelection(item.id)}
                >
                  {item.uhid}
                </td>
                <td
                  className="border border-gray-300 px-4 py-2"
                  onClick={() => onSelection(item.id)}
                >
                  {item.guardianMobile}
                </td>
                <td
                  className="border border-gray-300 px-4 py-2"
                  onClick={() => onSelection(item.id)}
                >
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
