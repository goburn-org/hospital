import { humanizedDate, isSameDate, ReceiptReport } from '@hospital/shared';
import React, { useEffect, useState } from 'react';
import { useBankAccounts } from '../../../provider/use-bank-account';
import { HttpService } from '../../../utils/http';
import { fetchDoctorName } from '../../employee/use-employee-query';

export const CashCardReport: React.FC = () => {
  const [data, setData] = useState<ReceiptReport | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data: bankAccounts } = useBankAccounts();
  const [users, setUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    HttpService.get<ReceiptReport>('/v1/billing/report').then((res) => {
      setData(res);
      const _empIds = res.byEmp
        .map((item) => item.empId)
        .filter(Boolean) as string[];
      const empIds = Array.from(new Set(_empIds));
      fetchDoctorName(empIds).then((res) => {
        setUsers(res);
      });
    });
  }, []);
  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800">Cash/Card Report</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-200 text-left font-normal text-base">
              Date
            </th>
            <th className="border border-gray-300 p-3 bg-gray-200 text-right font-normal text-base">
              Cash (₹)
            </th>
            <th className="border border-gray-300 p-3 bg-gray-200 text-right font-normal text-base">
              Card (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.details.map((item, index) => (
            <tr key={index} className="even:bg-gray-50">
              <td className="border border-gray-300 p-3">
                <button
                  type="button"
                  className="btn-text-secondary btn-small w-full justify-end underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedDate(new Date(item.date));
                  }}
                >
                  {item.date}
                </button>
              </td>
              <td className="border border-gray-300 p-3 text-right">
                ₹ {item.cash.toLocaleString()}
              </td>
              <td className="border border-gray-300 p-3 text-right">
                ₹ {item.card.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDate ? (
        <div>
          <h1 className="text-xl font-semibold text-gray-400 mt-9">
            Account Details
          </h1>
          <table className="w-full border-collapse border border-gray-300 ">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-gray-200 text-left font-normal text-base">
                  Date
                </th>
                <th className="border border-gray-300 p-3 bg-gray-200 text-right font-normal text-base">
                  Account Name
                </th>
                <th className="border border-gray-300 p-3 bg-gray-200 text-right font-normal text-base">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.accountDetails
                .filter((item) => isSameDate(selectedDate, item.date))
                .map((item, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      {humanizedDate(item.date)}
                    </td>
                    <td className="border border-gray-300 p-3 text-right">
                      {
                        bankAccounts?.find(
                          (account) => account.id === item.bankAccountId,
                        )?.name
                      }
                    </td>
                    <td className="border border-gray-300 p-3 text-right">
                      ₹ {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {selectedDate ? (
        <div>
          <h1 className="text-xl font-semibold text-gray-400 mt-9">
            Cash Details
          </h1>
          <table className="w-full border-collapse border border-gray-300 ">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-gray-200 text-left font-normal text-base">
                  Date
                </th>
                <th className="border border-gray-300 p-3 bg-gray-200 text-right font-normal text-base">
                  Employee Name
                </th>
                <th className="border border-gray-300 p-3 bg-gray-200 text-right font-normal text-base">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.byEmp
                .filter((item) => isSameDate(selectedDate, item.date))
                .map((item, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      {humanizedDate(item.date)}
                    </td>
                    <td className="border border-gray-300 p-3 text-right">
                      {item.empId ? users[item.empId] : 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-3 text-right ">
                      <div className="flex justify-end items-center">
                        {item.cashAmount < 0 ? (
                          <div className="flex items-center px-2 py-1 gap-2 bg-orange-200 rounded-lg w-fit justify-end">
                            <p className="font-semibold text-orange-950">
                              Refund
                            </p>
                            <p className="font-semibold text-orange-950">
                              {(-1 * item.cashAmount).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          `₹ ${item.cashAmount.toLocaleString()}`
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};
