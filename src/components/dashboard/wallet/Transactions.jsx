import React, { useState } from "react";
import { Button } from "../../common/Button";
import TopControls from "../../common/TopControls";

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
      <div className="bg-white rounded-lg shadow p-4 sm:p-8">
        {/* Top Controls */}
        <TopControls page={page} setPage={setPage} />
        {/* Table */}
        <div className="max-w-[330px] sm:max-w-[650px] lg:max-w-full w-full overflow-x-auto">
          <table className=" min-w-[900px] overflow-x-auto w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-bgLayout ">
                <th className="py-6 px-6 sm:px-2">ID</th>
                <th className="py-6 px-6 sm:px-2">Type</th>
                <th className="py-6 px-6 sm:px-2">Amount</th>
                <th className="py-6 px-6 sm:px-2">Current Amount</th>
                <th className="py-6 px-6 sm:px-2">Service ID</th>
                <th className="py-2 px-6 sm:px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_TRANSACTIONS.map((tx, idx) => (
                <tr key={idx} className="border-b border-bgLayout text-xs sm:text-sm">
                  <td className="py-4 px-1 sm:px-2">
                    <div className="flex items-center gap-4">
                      <img src={tx.icon} alt="icon" className="[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)] w-5 h-5" />
                      <span className="text-tertiary font-semibold">{tx.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 sm:px-2">
                    <div>
                      <span className="font-semibold text-text-primary">{tx.type}</span>
                      <p className="text-xs text-tertiary">{tx.date}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 sm:px-2 font-semibold text-primary">₦{tx.amount}</td>
                  <td className="py-4 px-6 sm:px-2 font-semibold text-primary">₦{tx.currentAmount}</td>
                  <td className="py-4 px-6 sm:px-2 text-text-primary">{tx.serviceId}</td>
                  <td className="py-4 px-6 sm:px-2 font-semibold">
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