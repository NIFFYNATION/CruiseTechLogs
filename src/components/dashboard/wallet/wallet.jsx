import React, { useState } from "react";
import WalletCard from "../../WalletCard";
import { Button } from "../../common/Button";
import FundWalletModal from "./FundWalletModal";

const DUMMY_TRANSACTIONS = [
  {
    id: 452425,
    amount: "2,500",
    status: "Complete",
    type: "Wallet Topup",
    ref: "tx-ref-678e88dfc7f1",
    date: "Sat, 29 Mar 2025 01:25:06pm",
  },
  {
    id: 452425,
    amount: "2,500",
    status: "Pending",
    type: "Wallet Topup",
    ref: "tx-ref-678e88dfc7f1",
    date: "Sat, 29 Mar 2025 01:25:06pm",
  },
  {
    id: 452425,
    amount: "2,500",
    status: "Complete",
    type: "Wallet Topup",
    ref: "tx-ref-678e88dfc7f1",
    date: "Sat, 29 Mar 2025 01:25:06pm",
  },
  {
    id: 452425,
    amount: "2,500",
    status: "Failed",
    type: "Wallet Topup",
    ref: "tx-ref-678e88dfc7f1",
    date: "Sat, 29 Mar 2025 01:25:06pm",
  },
];

const Wallet = () => {
  const [balance] = useState("0.00");
  const [cryptoCurrency] = useState("BTC");
  const [cryptoAddress] = useState("0xaB618960d0444d48c8e7Dbd4493a574056894b0a1");
  const [exchangeRate] = useState("2,500");
  const [network] = useState("bsc");
  const [transactions] = useState(DUMMY_TRANSACTIONS);
  const [fundModalOpen, setFundModalOpen] = useState(false);

  return (
    <div className="p-2 sm:p-6">
      <h2 className="text-xl font-semibold mb-6 text-primary">My Wallet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card + Virtual Account */}
        <div className="flex flex-col gap-4 border border-bgLayout shadow border-b-[#FEBB4F]  bg-white rounded-xl p-2">
          {/* Balance Card */}
          <div className="overflow-hidden">
          <div className=" relative">
          <WalletCard  balance={balance} onAddFunds={() => setFundModalOpen(true)} onTransactions={() => alert("Show Transactions")} />
          </div>
            {/* Virtual Account Details */}
            <div className="py-6 px-4">
              <h4 className="font-semibold mb-2 text-base md:text-lg">Fund Wallet with Virtual Account Details</h4>
              <p className="text-sm md:text-base text-text-secondary mb-4">
                Make payment here to automatically fund your account.
              </p>
              <div className="my-6">
                <div className="text-xs font-semibold text-text-secondary mb-1">PalmPay</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg  tracking-wider">852 034 6145</span>
                  <img src="/icons/copy-bold.svg" alt="Copy" className="w-4 h-4 cursor-pointer" onClick={() => {navigator.clipboard.writeText("8520346145");}} />
                </div>
                <div className="text-xs  text-text-secondary">
                  Account Name: <span className="font-bold text-text-primary">CRUISE TECH</span>
                </div>
              </div>
              <div className="border-t border-border-grey border-1 border-dashed my-6" />
              <div>
                <div className="text-xs font-semibold text-text-secondary mb-1">Moniepoint Micro Finance Bank</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-wider">852 034 6145</span>
                  <img src="/icons/copy-bold.svg" alt="Copy" className="w-4 h-4 cursor-pointer" onClick={() => {navigator.clipboard.writeText("8520346145");}} />
                </div>
                <div className="text-xs text-text-secondary">
                  Account Name: <span className="font-bold text-text-primary">CRUISE TECH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Crypto Card */}
        <div className="bg-white rounded-xl shadow py-6 px-4 flex flex-col gap-4">
          <h4 className="font-semibold text-text-primary text-lg">Fund Wallet with Crypto</h4>
          <p className="text-sm md:text-base text-text-secondary mb-4">
            Please scan the QR code below or copy the wallet address to proceed with your transaction.
          </p>
          {/* Currency Selector */}
            
            <div className="flex justify-between bg-bgLayout items-center gap-1 border border-[#D9D9D9] rounded-lg px-4 py-2 cursor-pointer">
            <div>
            <p className="text-xs font-semibold text-text-secondary">CURRENCY</p>
            <p className="font-semibold text-primary">Bitcoin</p>
            </div>
            <div className="flex items-center gap-3">
            BTC
              <img src="/icons/btc.svg" alt="BTC" className="w-5 h-5" />
              <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            </div>
          {/* QR Code */}
          <div className="flex flex-col items-center mb-4 ">
            <div className="relative bg-bgLayout rounded-lg p-2 ring-1 ring-[#D9D9D9]">
              <img src="/icons/qr.svg" alt="QR Code" className="w-36 h-36" />
              <img src="/icons/btc.svg" alt="BTC" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full p-1 shadow" />
            </div>
            <Button
              variant="orange"
              size="sm"
              className="w- mt-4"
              onClick={() => alert("Scan QR Code")}
            >
              Scan QR Code
            </Button>
          </div>
          {/* Wallet Address */}
          <div className="flex justify-between items-center gap-2 bg-[#E8F0FE] rounded-lg px-4 py-3 mb-2">
            <div>
            <p className="text-xs font-medium text-primary rounded py-1">BTC WALLET ADDRESS</p>
            <p className="font-mono text-sm font-semibold text-primary break-all">{cryptoAddress}</p>
            </div>
            <button
              className="ml-2"
              onClick={() => {
                navigator.clipboard.writeText(cryptoAddress);
                alert("Copied!");
              }}
            >
              <img src="/icons/copy-bold-blue.svg" alt="Copy" className="w-5 h-5" />
            </button>
          </div>
          <div className=" items-center gap-4 mb-2">
           <div className="flex gap-2 items-center">
           <p className="text-xs text-text-secondary">Exchange Rate:</p>
           <p className="font-semibold text-primary">₦{exchangeRate}</p>
           </div>
           <div className="flex gap-2 items-center">
           <p className="text-xs text-text-secondary">Network:</p>
           <p className="font-semibold text-primary">{network}</p>
           </div>
          </div>
        </div>
      </div>
      {/* Recent Transactions */}
      <div className="bg-white overflow-x-auto rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-primary text-base">Recent Transactions</h4>
          <Button
            variant="orange"
            size="sm"
            className="px-4"
            onClick={() => alert("View All Transactions")}
          >
            View All Transactions
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left  text-text-secondary border-b border-bgLayout">
                <th className="py-2 px-1 sm:px-2">ID</th>
                <th className="py-2 px-1 sm:px-2">Amount</th>
                <th className="py-2 px-1 sm:px-2">Status</th>
                <th className="py-2 px-1 sm:px-2">Type</th>
                <th className="py-2 px-1 sm:px-2">Ref. No.</th>
                <th className="py-2 px-1 sm:px-2 py-2 px-1 sm:px-2 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="overflow-x-auto border-b border-bgLayout text-xs sm:text-sm">
                  <td className="py-2 px-1 sm:py-3 sm:px-2 text-tertiary">{tx.id}</td>
                  <td className="py-2 px-1 sm:py-3 sm:px-2 font-semibold text-primary">₦{tx.amount}</td>
                  <td className={`py-2 px-1 sm:py-3 sm:px-2 font-semibold ${tx.status === "Complete" ? "text-success" : tx.status === "Pending" ? "text-quinary" : "text-danger"}`}>{tx.status}</td>
                  <td className="py-2 px-1 sm:py-3 sm:px-2">{tx.type}</td>
                  <td className="py-2 px-1 sm:py-3 sm:px-2 max-w-[80px] sm:max-w-none truncate">{tx.ref}</td>
                  <td className="py-2 px-1 sm:py-3 sm:px-2 whitespace-nowrap py-2 px-1 sm:px-2 hidden sm:table-cell text-tertiary">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FundWalletModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        onConfirm={amount => {
          setFundModalOpen(false);
          alert(`You want to fund ₦${amount}`);
          // Handle your top-up logic here
        }}
      />
    </div>
  );
};

export default Wallet;
