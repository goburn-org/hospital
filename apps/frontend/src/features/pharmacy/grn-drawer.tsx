import { XMarkIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateGrnLineItemRequest,
  createGrnLineItemSchema,
  humanizedDate,
} from '@hospital/shared';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FormAutoCompleteInput } from '../../component/form/form-auto-complete-input';
import { FormInput } from '../../component/form/form-input';
import { FormTab, FormTabs } from '../../component/form/form-tabs';
import { useEsc } from '../../utils/use-esc';
import { useProductQuery } from '../product/use-product-query';
import { useGrnMutation, useIntentQuery } from './use-pharmacy-query';

export const GrnDrawer = ({
  defaultValues,
  mode,
}: {
  defaultValues?: CreateGrnLineItemRequest[];
  mode: 'create' | 'edit' | 'view';
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreateGrnLineItemRequest>({
    resolver: zodResolver(createGrnLineItemSchema),
  });
  const { mutateAsync } = useGrnMutation();
  const [intentId, setIntentId] = useState<string>();
  const [productSearch, setProductSearch] = useState('');
  const [tabs, setTabs] = useState<FormTab[]>([
    {
      name: 'Select Intent' as const,
      current: true,
      completed: !!intentId,
      inProgress: true,
    },
    {
      name: 'GRN' as const,
      current: false,
      completed: formProvider.formState.isSubmitted,
      inProgress: false,
    },
  ]);
  const [items, setItems] = useState<CreateGrnLineItemRequest[]>(
    defaultValues || [],
  );
  useEffect(() => {
    if (defaultValues) {
      setTabs((t) =>
        t.map((t) => ({
          ...t,
          completed: true,
          current: t.name !== 'Select Intent',
        })),
      );
      setItems(defaultValues);
    }
  }, [defaultValues]);
  const { data } = useProductQuery({
    search: productSearch,
    paginate: {
      limit: 10,
      page: 1,
    },
  });
  const activeIndex = tabs.findIndex((tab) => tab.current);
  const setCurrentTab = async (tab: FormTab) => {
    setTabs((t) =>
      t.map((t) => ({
        ...t,
        current: t.name === tab.name,
        completed: t.name === 'Select Intent' ? true : t.completed,
      })),
    );
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
          {mode} Intent
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
          setSelected={(id) => {
            setIntentId(id);
            setCurrentTab(tabs[1]);
          }}
        />
      ) : (
        <FormProvider {...formProvider}>
          <form
            className="flex max-h-[90vh] flex-col"
            onSubmit={formProvider.handleSubmit((p) => {
              setItems((i) => [...i, p]);
              formProvider.reset();
            })}
          >
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <FormAutoCompleteInput<CreateGrnLineItemRequest>
                  isRequired
                  id="productId"
                  labelName="Product Name"
                  placeholder=" Product Name"
                  options={data?.data.map((item) => ({
                    label: item.name,
                    id: item.id,
                  }))}
                  onSearch={setProductSearch}
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateGrnLineItemRequest>
                  isRequired
                  id="quantity"
                  labelName="Quantity"
                  placeholder=" 20"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateGrnLineItemRequest>
                  isRequired
                  id="costPrice"
                  labelName="Cost Price"
                  placeholder=" 200"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateGrnLineItemRequest>
                  isRequired
                  id="sellPrice"
                  labelName="Sell Price"
                  placeholder=" 200"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateGrnLineItemRequest>
                  isRequired
                  id="mrp"
                  labelName="MRP"
                  placeholder=" 200"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateGrnLineItemRequest>
                  isRequired
                  id="expiryDate"
                  labelName="Expire Date"
                  placeholder=" 20/12/2022"
                  autoComplete="off"
                  type="date"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateGrnLineItemRequest>
                  isRequired
                  id="batchNumber"
                  labelName="Batch Number"
                  placeholder=" 123123"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-text btn-text-small">
                Add
              </button>
            </div>
            <GrnTable items={items} />
            <div className="flex justify-end mt-10">
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  await mutateAsync({
                    grnLineItem: items,
                  });
                  toast.success('GRN created successfully');
                  navigate('../', {
                    replace: true,
                  });
                }}
                className="btn-primary"
              >
                Create GRN
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

const GrnTable = ({ items }: { items: CreateGrnLineItemRequest[] }) => {
  return (
    <div className="mt-10">
      {items.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Cost Price</th>
              <th className="border border-gray-300 px-4 py-2">Expire Date</th>
              <th className="border border-gray-300 px-4 py-2">Batch Number</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {item.productId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.costPrice}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {humanizedDate(item.expiryDate)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.batchNumber}
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

const Table = ({ setSelected }: { setSelected: (id: string) => void }) => {
  const { data } = useIntentQuery();
  if (data === undefined) return null;
  return (
    <div className="mt-10">
      {data?.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Products</th>
              <th className="border border-gray-300 px-4 py-2">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                <td
                  className="border border-gray-300 px-4 py-2"
                  onClick={() => setSelected(item.id)}
                >
                  {item.json.map((i) => i.productId).join(', ')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.json.map((i) => i.supplier).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
