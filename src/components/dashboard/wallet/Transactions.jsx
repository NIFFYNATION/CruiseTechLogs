import React, { useState } from "react";
import { Button } from "../../common/Button";

const DUMMY_TRANSACTIONS = [
  {
    id: 452425,
    type: "Wallet Topup",
    amount: "1,200",
    currentAmount: "1,200",
    serviceId: "order-67e7f4b299c6d",
    date: "10 Mar, 2025 at 5:43PM",
    action: "Credit",
    icon: "/icons/wallet-topup.svg",
  },
  {
    id: 452425,
    type: "Wallet Topup",
    amount: "1,200",
    currentAmount: "1,200",
    serviceId: "order-67e7f4b299c6d",
    date: "10 Mar, 2025 at 5:43PM",
    action: "Debit",
    icon: "/icons/wallet-topup.svg",
  },
  {
    id: 452425,
    type: "Wallet Topup",
    amount: "1,200",
    currentAmount: "1,200",
    serviceId: "order-67e7f4b299c6d",
    date: "10 Mar, 2025 at 5:43PM",
    action: "Credit",
    icon: "/icons/wallet-topup.svg",
  },
  {
    id: 452425,
    type: "Wallet Topup",
    amount: "1,200",
    currentAmount: "1,200",
    serviceId: "order-67e7f4b299c6d",
    date: "10 Mar, 2025 at 5:43PM",
    action: "Credit",
    icon: "/icons/wallet-topup.svg",
  },
];

const Transactions = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  return (
    <div className="p-2 sm:p-6">
      <h2 className="text-xl font-semibold mb-6 text-primary">Transactions</h2>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-8">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span>showing 1 - 20 results</span>
          </div>
          {/* Pagination */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 8, 9, 10].map((n, i) =>
              n === 8 ? (
                <span key={n} className="mx-1 text-tertiary">...</span>
              ) : (
                <button
                  key={n}
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition
                    ${page === n
                      ? "bg-quinary text-white"
                      : "bg-background text-text-secondary border border-border-grey hover:bg-quinary hover:text-white"}
                  `}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              )
            )}
          </div>
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">items per page</span>
            <select className="ring-1 ring-border-grey rounded-sm px-3 py-1 bg-white text-text-primary focus:outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="max-w-[310px] sm:max-w-full w-full overflow-x-auto">
          <table className=" min-w-[900px] overflow-x-auto w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-border-grey">
                <th className="py-2 px-1 sm:px-2">ID</th>
                <th className="py-2 px-1 sm:px-2">Type</th>
                <th className="py-2 px-1 sm:px-2">Amount</th>
                <th className="py-2 px-1 sm:px-2">Current Amount</th>
                <th className="py-2 px-1 sm:px-2">Service ID</th>
                <th className="py-2 px-1 sm:px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_TRANSACTIONS.map((tx, idx) => (
                <tr key={idx} className="border-b border-border-grey text-xs sm:text-sm">
                  <td className="py-4 px-1 sm:px-2">
                    <div className="flex items-center gap-2">
                      <img src={tx.icon} alt="icon" className="w-5 h-5" />
                      <span className="text-text-primary font-semibold">{tx.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-1 sm:px-2">
                    <div>
                      <span className="font-semibold text-text-primary">{tx.type}</span>
                      <div className="text-xs text-tertiary">{tx.date}</div>
                    </div>
                  </td>
                  <td className="py-4 px-1 sm:px-2 font-semibold text-primary">₦{tx.amount}</td>
                  <td className="py-4 px-1 sm:px-2 font-semibold text-primary">₦{tx.currentAmount}</td>
                  <td className="py-4 px-1 sm:px-2 text-text-primary">{tx.serviceId}</td>
                  <td className="py-4 px-1 sm:px-2 font-semibold">
                    {tx.action === "Credit" ? (
                      <span className="text-success">Credit</span>
                    ) : (
                      <span className="text-danger">Debit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;