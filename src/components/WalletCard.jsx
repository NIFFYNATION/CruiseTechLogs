import React from "react";

const WalletCard = ({ balance, onAddFunds, onTransactions }) => (
  <div
    className="rounded-[20px] relative overflow-hidden h-full bg-gradient-to-br from-[#FF6B00] to-[#FFB347]"
    style={{
      background: `#FF6B00 url('/balance-card-bg.png') no-repeat center center`,
      backgroundSize: "cover",
    }}
  >
    <div className="flex flex-col justify-between items-start md:items-center h-full p-8">
      <div className="text-center">
        <p className="text-white/90 text-sm mb-0 md:mb-10 mt-0 md:mt-4">
          Your Total Balance
        </p>
        <h2 className="text-[42px] font-bold text-white">₦ {balance}</h2>
      </div>
      <div className="flex gap-3 justify-center">
        <button
          className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-full text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors"
          onClick={onAddFunds}
        >
          <img src="/icons/add-circle.svg" alt="" className="h-6 w-6" />
          Add Funds
        </button>
        <button
          className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-full text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors"
          onClick={onTransactions}
        >
          <img src="/icons/list-broken.svg" alt="" className="h-6 w-6" />
          Transactions
        </button>
      </div>
    </div>
  </div>
);

export default WalletCard;

