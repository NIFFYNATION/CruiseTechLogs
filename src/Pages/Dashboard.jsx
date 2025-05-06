import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import ProductCard from '../components/dashboard/ProductCard';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { FaWallet, FaFacebook } from 'react-icons/fa';

const Dashboard = () => {
  // Sample transactions data
  const transactions = [
    {
      id: 1,
      title: "Wallet Top-up",
      date: "2024-02-20 15:45",
      status: "Successful",
      type: "credit",
      amount: "15,000",
      icon: <FaWallet className="text-green-500" />
    },
    {
      id: 2,
      title: "Facebook Purchase",
      date: "2024-02-19 10:30",
      status: "Failed",
      type: "debit",
      amount: "15,000",
      icon: <FaFacebook className="text-red-500" />
    }
  ];

  return (
    <DashboardLayout>
      {/* Header with Search and Profile */}
      <DashboardHeader />

      {/* Welcome Section with all cards */}
      <WelcomeSection />

      {/* Products Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Random Countries Facebook</h2>
          <button className="text-[#FF6B00] font-medium">See all</button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <ProductCard
              key={index}
              title="Facebook USA - $50/Month"
              description="30 days warranty"
              price="15,000"
              additionalInfo="Best quality in stock"
            />
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactions} />
    </DashboardLayout>
  );
};

export default Dashboard; 