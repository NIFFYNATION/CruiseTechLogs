import React from "react";
import { Button } from "../../common/Button";

const VirtualAccountCard = ({ accounts = [], onCopy }) => {
  if (!accounts || accounts.length === 0) return null;
  return (
    <div className="py-6 px-4">
      <h4 className="font-semibold mb-2 text-base md:text-lg">Fund Wallet with Virtual Account Details</h4>
      <p className="text-sm md:text-base text-text-secondary mb-2">
        Make payment here to automatically fund your account.
      </p>
      <p className="text-xs md:text-sm text-red-600 mb-4">
        Before sending money, double-check the bank name and account number.
        Make sure you are paying into the correct bank.
      </p>
      {accounts.map((acc, idx) => (
        <div className="my-6" key={acc.ID || idx}>
          <div className="text-sm md:text-base font-extrabold text-text-primary mb-1">
            {acc.bank_name}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wider">{acc.account_number}</span>
            <img
              src="/icons/copy-bold.svg"
              alt="Copy"
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(acc.account_number);
                if (onCopy) onCopy(acc.account_number);
              }}
            />
          </div>
          <div className="text-xs text-text-secondary">
            Note: <span className="font-bold text-text-primary">{acc.note}</span>
          </div>
        </div>
      ))}
      
      
    </div>
  );
};

export default VirtualAccountCard;
