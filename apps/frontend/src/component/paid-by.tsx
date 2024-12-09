import { BanknotesIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBankAccounts } from '../provider/use-bank-account';
import { CustomSelect } from './select';

export const PaidBy = ({
  totalAmount,
  id,
}: {
  totalAmount: number;
  id?: string;
}) => {
  const { setValue, watch, getValues } = useFormContext();
  const cardId = id ? `${id}.cardAmount` : 'cardAmount';
  const cashId = id ? `${id}.cashAmount` : 'cashAmount';
  const { data } = useBankAccounts();
  const options =
    data?.map((item) => ({
      label: item.name,
      id: item.id,
      icon: (
        <div
          dangerouslySetInnerHTML={{
            __html: item.icon,
          }}
        />
      ),
    })) ?? [];
  const optionsWithCash = [
    {
      label: 'Cash',
      id: 'cash',
      icon: <BanknotesIcon />,
    },
    ...options,
  ];
  useEffect(() => {
    setValue(cardId, []);
    setValue(cashId, totalAmount);
  }, [cardId, cashId, getValues, setValue, totalAmount]);
  if (totalAmount === 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-x-4 mb-12">
      <div className="flex items-center gap-x-2">
        <CustomSelect
          disableSearch
          options={optionsWithCash}
          value={
            watch(cashId) !== 0 ? 'cash' : watch(cardId)?.[0]?.bankAccountId
          }
          htmlFor="paymentMethod"
          labelName="Payment Method"
          onChange={(selected) => {
            if (selected === 'cash') {
              setValue(cardId, []);
              setValue(cashId, totalAmount);
              return;
            }
            setValue(cashId, 0);
            setValue(cardId, [
              {
                bankAccountId: Number(selected),
                amount: totalAmount,
              },
            ]);
          }}
        />
      </div>
    </div>
  );
};
