import { ReceiptReport } from '@hospital/shared';
import React, { useEffect, useState } from 'react';
import { HttpService } from '../../../utils/http';

export const CashCardReport: React.FC = () => {
  const [data, setData] = useState<ReceiptReport[]>([]);
  useEffect(() => {
    HttpService.get<ReceiptReport[]>('/v1/billing/report').then((res) => {
      setData(res);
    });
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Cash/Card Report
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-200 text-left">
              Date
            </th>
            <th className="border border-gray-300 p-3 bg-gray-200 text-right">
              Cash (₹)
            </th>
            <th className="border border-gray-300 p-3 bg-gray-200 text-right">
              Card (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="even:bg-gray-50">
              <td className="border border-gray-300 p-3">{item.date}</td>
              <td className="border border-gray-300 p-3 text-right">
                {item.cash.toLocaleString()}
              </td>
              <td className="border border-gray-300 p-3 text-right">
                {item.card.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
