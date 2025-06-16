import React from "react";

const statusColors = {
  Complete: "text-success",
  Pending: "text-quinary",
  Failed: "text-red-500",
};

const TransactionRow = ({ tx }) => (
  <tr className="border-b border-border-grey text-xs sm:text-sm">
    <td className="py-2 px-1 sm:py-3 sm:px-2">{tx.id}</td>
    <td className="py-2 px-1 sm:py-3 sm:px-2 font-semibold text-primary">₦{tx.amount}</td>
    <td className={`py-2 px-1 sm:py-3 sm:px-2 font-semibold ${statusColors[tx.status]}`}>{tx.status}</td>
    <td className="py-2 px-1 sm:py-3 sm:px-2">{tx.type}</td>
    <td className="py-2 px-1 sm:py-3 sm:px-2 max-w-[80px] sm:max-w-none truncate">{tx.ref}</td>
    <td className="py-2 px-1 sm:py-3 sm:px-2 whitespace-nowrap">{tx.date}</td>
  </tr>
);

export default TransactionRow;
