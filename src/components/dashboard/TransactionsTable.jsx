import React from 'react';
import { IoCalendarOutline } from 'react-icons/io5';

const TransactionsTable = ({ transactions = [] }) => {
  const defaultTransactions = [
    {
      id: 1,
      title: "Wallet Topup",
      date: "10 Mar, 2025 at 5:43PM",
      status: "Successful",
      paymentMethod: "Credit Card",
      cardNumber: "**** 8989",
      amount: "1,200"
    },
    {
      id: 2,
      title: "Wallet Topup",
      date: "10 Mar, 2025 at 5:43PM",
      status: "Failed",
      paymentMethod: "Credit Card",
      cardNumber: "**** 8989",
      amount: "1,200"
    },
    {
      id: 3,
      title: "Wallet Topup",
      date: "10 Mar, 2025 at 5:43PM",
      status: "Successful",
      paymentMethod: "Credit Card",
      cardNumber: "**** 8989",
      amount: "1,200"
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : defaultTransactions;

  return (
    
  <div>
    <div className="bg-background rounded-lg p-4 sm:p-6">
      {/* Desktop Header */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-8 gap-4 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary  mb-10">All Transactions</h2>
          <div className="flex items-center mt-2">
            <button className="text-blue-900 font-medium border-b-2 border-blue-900 mr-4">
              History
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#F4F4F4] px-3 py-2 rounded-lg sm:w-auto">
          <IoCalendarOutline className="text-text-primary" />
          <span className="text-sm text-text-grey">5 Mar 25. - 10 Mar 25.</span>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex justify-between items-center mb-6 sm:hidden">
        <h2 className="text-lg font-semibold text-text-primary">All Transactions</h2>
        <button className="text-white bg-primary hover:bg-quinary rounded-full px-6 py-2 text-sm">
          View All
        </button>
      </div>

      {/* Mobile List */}
      <div className="sm:hidden divide-y divide-gray-100">
        {displayTransactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center py-4">
            <div className='flex justify-between'>
            <div className="flex-shrink-0">
            <img className="[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)] w-4 h-4" src="icons/wallet-topup.svg" alt="wallet-topup" />

            </div>
            <div className="ml-3 flex-1 ml-9">
              <div className="font-semibold text-text-secondary">{transaction.title}</div>
              <div className="text-xs text-gray-400">{transaction.date}</div>
            </div>
            </div>
            <div className="font-bold text-primary text-base ml-2">
              ₦ {transaction.amount}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (unchanged) */}
      <div className="hidden sm:block space-y-4">
        {displayTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4 sm:gap-0"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-10 h-10  flex items-center justify-center flex-shrink-0">
                <img  src="icons/wallet-topup.svg" alt="wallet-topup" />
              </div>
              <div>
                <p className="font-medium text-text-primary mb-2">{transaction.title}</p>
                <p className="text-sm font-medium text-text-grey ">{transaction.date}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto ">
              <span className={`px-8 py-1 font-medium rounded-full text-sm inline-block ${
                transaction.status === 'Successful' 
                  ? 'bg-green-50 text-success' 
                  : 'bg-red-50 text-danger'
              }`}>
                {transaction.status}
              </span>
            </div>
            <div className="text-left sm:text-center min-w-[150px]">
              <p className="text-text-secondary font-medium mb-2">{transaction.paymentMethod}</p>
              <p className="text-sm text-text-grey font-medium">{transaction.cardNumber}</p>
            </div>
            <div className="text-left sm:text-center text-quinary min-w-[100px]">
              <p className="font-medium">₦ {transaction.amount}</p>
            </div>
          </div>
        ))}
       
      </div>
    </div>
     <button className="hidden sm:block mt-6 text-white bg-quinary hover:bg-quaternary rounded-full px-6 py-3 w-full sm:w-auto">
          View All Transactions
        </button>
  </div>
  );
};

export default TransactionsTable; 