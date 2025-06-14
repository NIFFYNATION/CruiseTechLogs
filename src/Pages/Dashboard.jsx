import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add navigation for redirection
import WelcomeSection from '../components/dashboard/WelcomeSection';
import ProductCard from '../components/dashboard/ProductCard';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import ProductSection from '../components/dashboard/ProductSection';
import { isUserLoggedIn } from '../controllers/userController'; // Import userController

const productData = [
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
  },
  // ...repeat for as many cards as needed
];

const Dashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization

  return (
    <>
      {/* Welcome Section with all cards */}
      <WelcomeSection />

      <div className='bg-background px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-lg'>
        {/* Category Button */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <button className="flex items-center gap-2 border border-[#FF6B00] text-[#FF6B00] bg-background px-4 sm:px-8 py-2 rounded-sm font-medium text-sm shadow-sm">
            <div className='w-5 h-5'>
              <img src="/icons/filter.svg" alt="" />
            </div>
            All Categories
          </button>
        </div>

        {/* Random Countries Facebook Section */}
        <ProductSection
          title="Random Countries Facebook"
          products={Array(3).fill(productData[0])}
          onBuy={() => {}}
          onStockClick={() => {}}
          showViewAll={true}
          viewAllLabel="View All"
          mobileViewMoreLabel="View More Random Country Facebook"
        />

        {/* USA Facebook Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-text-primary">USA Facebook</h3>
            <button className="text-background font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border bg-quinary hover:bg-quaternary transition">
              View All
            </button>
          </div>
          <div className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array(3).fill().map((_, i) => (
              <ProductCard
                key={i}
                title={productData[0].title}
                stock={productData[0].stock}
                price={productData[0].price}
                onBuy={() => {}}
                onStockClick={() => {}}
              />
            ))}
          </div>
          <div className='flex md:hidden justify-center items-center mt-6 mb-6'>
           <p className='text-text-grey text-sm font-medium'>View More USA Facebook</p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-6">
          <button className="w-full sm:w-auto sm:min-w-[320px] bg-quinary hover:bg-quaternary text-white font-medium py-2.5 sm:py-3 rounded-full text-sm transition  block">
            View More Social Media Accounts
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-4 sm:mt-6">
        <TransactionsTable />
      </div>
    </>
  );
};

export default Dashboard;