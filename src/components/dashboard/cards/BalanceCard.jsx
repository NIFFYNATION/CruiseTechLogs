import React from "react";
import { useUser } from "../../../contexts/UserContext";

const BalanceCard = () => {
  const { user, loading } = useUser();

  if (loading || !user) {
    return (
      <div className="rounded-[20px] relative overflow-hidden h-[calc(100%-0px)] bg-[#FF6B00] flex items-center justify-center">
        <span className="text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-[20px] relative overflow-hidden h-[calc(100%-0px)]"
      style={{
        background: `#FF6B00 url('/balance-card-bg.png') no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col justify-between items-start md:items-center h-full p-8">
        <div className="text-center">
          <p className="text-white/90 text-sm mb-0 md:mb-10 mt-0 md:mt-4">Your Total Balance</p>
          <h2 className="text-[42px] font-bold text-white">
            ₦ {user.balance ? user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
          </h2>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-full text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors"
            onClick={() => { /* handle add funds */ }}
          >
            <img src="/icons/add-circle.svg" alt="" className="h-6 w-6" />
            Add Funds
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-full text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors"
            onClick={() => { /* handle transactions */ }}
          >
            <img src="/icons/list-broken.svg" alt="" className="h-6 w-6" />
            Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
