import React from 'react';
import { Card } from '../common/Card';

export const TransactionList = ({ transactions }) => {
  return (
    <Card className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-text-primary font-semibold">All Transactions</h3>
        <button className="text-primary text-sm">View All</button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                transaction.status === 'completed' ? 'bg-green-500' : 
                transaction.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <div>
                <p className="text-text-primary text-sm font-medium">{transaction.title}</p>
                <p className="text-text-secondary text-xs">{transaction.date}</p>
              </div>
            </div>
            <p className={`font-medium ${
              transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'
            }`}>
              {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}; 