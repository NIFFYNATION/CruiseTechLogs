import React from 'react';
import { IoCalendarOutline } from 'react-icons/io5';

const TransactionsTable = ({ transactions = [] }) => {
  const defaultTransactions = [];

  const displayTransactions = transactions.length > 0 ? transactions : defaultTransactions;

  return (
    
  <div>
        {/* Desktop Header */}
        <div className=" bg-background rounded-lg rounded-b-none p-4 sm:px-6 sm:pb-0 sm:pt-6 hidden sm:block flex-col sm:flex-row justify-between items-start sm:items-center mb-0.5 mt-8 gap-4 sm:gap-0 ">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary  mb-1">All Transactions</h2>
        <div className='flex justify-between'>
          <div className="flex items-center mt-3 border-b-3   border-primary">
            <button className="text-primary font-bold  mr-4 p-3">
              History
            </button>
          </div>
          <div className="flex items-center gap-2 bg-bgLayout px-4 py-2  rounded-lg sm:w-auto my-4">
          <img src="/icons/calendar.svg" alt="calender" />
          <span className="text-sm font-semibold text-text-grey">5 Mar 25. - 10 Mar 25.</span>
        </div>
        </div>
       
      </div>
    <div className="bg-background rounded-lg rounded-t-lg sm:rounded-t-none p-4 sm:p-6">
  

      {/* Mobile Header */}
      <div className="flex justify-between items-center mb-6 sm:hidden ">
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
            <img className="[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)] w-4 h-4" src="/icons/wallet-topup.svg" alt="wallet-topup" />

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
        <p className="text-sm font-semibold text-text-grey">10 Mar, 2025</p>
        {displayTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4 sm:gap-0"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-10 h-10  flex items-center justify-center flex-shrink-0">
                <img  src="/icons/wallet-topup.svg" alt="wallet-topup" />
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