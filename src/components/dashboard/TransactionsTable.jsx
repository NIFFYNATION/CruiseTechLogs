import React from 'react';
import { FaSearch, FaWallet, FaFacebook } from 'react-icons/fa';

const TransactionsTable = ({ transactions = [] }) => {
  const defaultTransactions = [
    {
      id: 1,
      title: "Wallet Top-up",
      date: "2024-02-20 15:45",
      status: "Successful",
      type: "credit",
      amount: "15,000",
      icon: <FaWallet className="text-green-500" />
    },
    {
      id: 2,
      title: "Facebook Purchase",
      date: "2024-02-19 10:30",
      status: "Failed",
      type: "debit",
      amount: "15,000",
      icon: <FaFacebook className="text-red-500" />
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : defaultTransactions;

  return (
    <div className="bg-white rounded-xl p-6 mt-8 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Transactions</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B00]"
            />
          </div>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FF6B00]">
            <option>Filter by</option>
            <option>Status</option>
            <option>Date</option>
            <option>Amount</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 text-gray-600 font-medium">History</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Status</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Credit/Debit</th>
              <th className="text-right py-4 px-4 text-gray-600 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.title}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    transaction.status === 'Successful' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-600">{transaction.type}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-medium text-gray-800">₦{transaction.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable; 