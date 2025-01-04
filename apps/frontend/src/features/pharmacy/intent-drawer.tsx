import { XMarkIcon } from '@heroicons/react/20/solid';
import { PencilIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateIntentLineItemRequest,
  createIntentLineItemSchema,
  IntentResponse,
} from '@hospital/shared';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormAutoCompleteInput } from '../../component/form/form-auto-complete-input';
import { FormInput } from '../../component/form/form-input';
import {
  FormMode,
  FormModeProvider,
} from '../../provider/form-context-provider/form-mode-provider';
import { useEsc } from '../../utils/use-esc';
import { useProductQuery } from '../product/use-product-query';
import { useIntentMutation } from './use-pharmacy-query';

export const IntentDrawer = ({
  defaultValues,
  mode,
}: {
  defaultValues?: IntentResponse;
  mode: 'create' | 'edit' | 'view';
}) => {
  const navigate = useNavigate();
  const formProvider = useForm<CreateIntentLineItemRequest>({
    resolver: zodResolver(createIntentLineItemSchema),
  });
  const [items, setItems] = useState<CreateIntentLineItemRequest[]>(
    defaultValues?.json || [],
  );
  const { mutateAsync } = useIntentMutation();
  const [editId, setEditId] = useState<number>();
  const [productSearch, setProductSearch] = useState('');
  const { data } = useProductQuery({
    search: productSearch,
    paginate: {
      limit: 10,
      page: 1,
    },
  });

  useEsc(() => {
    navigate('..', {
      replace: true,
    });
  });
  const editable = mode !== 'view';
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
      <FormModeProvider
        mode={editable ? FormMode.Editable : FormMode.ReadOnly}
        oldId={`${editId}`}
      >
        <FormProvider {...formProvider}>
          <form
            className="flex max-h-[90vh] flex-col"
            onSubmit={formProvider.handleSubmit((p) => {
              if (mode === 'create') {
                setItems([...items, p]);
              }
              if (mode === 'edit' && editId !== undefined) {
                const newItems = [...items];
                newItems[editId] = p;
                setItems(newItems);
              }
              formProvider.reset();
            })}
          >
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <FormAutoCompleteInput<CreateIntentLineItemRequest>
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
                <FormInput<CreateIntentLineItemRequest>
                  isRequired
                  id="quantity"
                  labelName="Quantity"
                  placeholder=" 20"
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput<CreateIntentLineItemRequest>
                  isRequired
                  id="supplier"
                  labelName="Supplier"
                  placeholder=" Supplier Name"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-text">
                {mode === 'create' ? 'Add' : 'Update'}
              </button>
            </div>
            <Table items={items} />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  mutateAsync(items);
                }}
              >
                Create Intent
              </button>
            </div>
          </form>
        </FormProvider>
      </FormModeProvider>
    </div>
  );
};

const Table = ({ items }: { items: CreateIntentLineItemRequest[] }) => {
  return (
    <div className="mt-10">
      {items.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Supplier</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
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
                  {item.supplier}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <PencilIcon className="w-3 h-3" />
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
