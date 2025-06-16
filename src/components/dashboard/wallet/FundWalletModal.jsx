import React, { useState } from "react";

const FundWalletModal = ({ open, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Header */}
        <div className="bg-bgLayout flex items-center justify-between px-8 py-6 border-b border-border-grey">
          <h2 className="text-lg font-semibold">Fund Wallet</h2>
          <button
            className="text-2xl text-tertiary hover:text-quinary"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Body */}
        <div className="px-12 py-8">
          <label className="block text-base font-medium mb-4">Amount to top-up</label>
          <div className="flex items-center rounded-lg border border-[#D9D9D9] mb-8">
            <span className="px-6 py-4 rounded-l-lg bg-[#D9D9D9] text-xl text-primary font-bold">₦</span>
            <input
              type="number"
              min="0"
              className="flex-1 bg-transparent outline-none border-none py-4 px-2 text-lg"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
            />
          </div>
          <button
            className="w-full md:w-1/3 bg-quinary text-white rounded-full py-3 font-semibold text-base hover:bg-quaternary transition"
            onClick={() => {
              if (amount && Number(amount) > 0) {
                onConfirm(amount);
                setAmount("");
              }
            }}
            disabled={!amount || Number(amount) <= 0}
          >
            Confirm Amount
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundWalletModal;