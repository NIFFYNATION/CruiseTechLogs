import React from 'react';
import BalanceCard from './cards/BalanceCard'; // <-- Make sure this import exists and the file is present
import { Button } from '../common/Button';

const WelcomeSection = () => {
  return (
    <div className="mb-8 mt-8">
      {/* Welcome Text */}
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Welcome back!</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
        {/* Balance Card - Takes 2 columns */}
        <div className="col-span-2 h-full">
          <BalanceCard />
        </div>
        {/* Right Column Cards - Flex on tablet, stack on mobile and desktop */}
        <div className="flex flex-col md:flex-row lg:flex-col gap-4 md:gap-6 mt-0 sm:mt-6 md:mt-8 lg:mt-0">
          {/* Order Card */}
          <div className="bg-background hidden md:block mt-8 sm:mt-0 rounded-[15px] border-b-primary border-b-2 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <h3 className="text-text-primary text-lg font-semibold mb-2">Your Total Order</h3>
                <div className="flex items-center justify-between">
                 <Button variant="primary" size="sm" className="w-fit">
                  View All Orders
                 </Button>
                  <p className="text-[40px] font-bold text-[#015C67]">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* Get Number Card */}
          <div className="bg-background mt-8 md:mt-0 rounded-[15px] border-b-primary border-b-2 px-6 pt-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1">
            <div className="flex items-end justify-between mt-auto">
              <div className="py-4">
                <h3 className="text-text-primary text-lg font-semibold mb-2">Get Number</h3>
                <p className="text-text-secondary text-xs mb-4">
                  Get phone number to receive OTP
                  for short term or long term use.
                </p>
                <Button variant="primary" size="sm" className="w-fit">
                  Buy Number Now
                 </Button>
              </div>
              <img 
                src="/number-illustration.png" 
                alt="Get Number" 
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>
          {/* Buy Social Media Accounts */}
          <div className="block md:hidden mt-8 md:mt-0 rounded-[15px] border-b-quinary border-b-2 pl-6 pt-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1 "
            style={{
              background: `linear-gradient(rgba(255, 106, 0, 0.03), rgba(255, 107, 0, 0.1)), url('/background-buyaccounts.svg') no-repeat center center`,
              backgroundSize: '600px 500px'
            }}>
            <div className=" items-end justify-between mt-auto">
              <div className="px-2">
                <h3 className="text-text-primary text-lg font-semibold mb-2">Buy Social Media Accounts</h3>
                <p className="text-text-secondary text-sm">
                Get long-lasting social media accounts from nearly every major platform—secure and ready for use.
                </p>
                
              </div>
              <div className='flex justify-between items-center p-0'>
              <Button variant="orange" size="sm" className="w-fit">
                  Buy Account Now
                 </Button>
              <img 
                src="/icons/holding-smartphone.svg" 
                alt="Buy Accounts Now" 
                className="w-28 h-28 object-contain"
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;