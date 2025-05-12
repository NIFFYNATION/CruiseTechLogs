import React from 'react';

const WelcomeSection = () => {
  return (
    <div className="mb-8 mt-8">
      {/* Welcome Text */}
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Welcome back!</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
        {/* Balance Card - Takes 2 columns */}
        <div className="col-span-2 h-full">
          <div className="rounded-[20px] relative overflow-hidden h-[calc(100%-0px)]" 
            style={{
              background: `#FF6B00 url('/balance-card-bg.png') no-repeat center center`,
              backgroundSize: 'cover'
            }}>
            <div className="flex flex-col justify-between h-full p-8">
              <div className="text-center">
                <p className="text-white/90 text-sm mb-1">Your Total Balance</p>
                <h2 className="text-[42px] font-bold text-white">₦ 0.00</h2>
              </div>
              <div className="flex gap-3 justify-center">
                <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-[10px] text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Add Funds
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-[10px] text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                  Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column Cards - Flex on tablet, stack on mobile and desktop */}
        <div className="flex flex-col md:flex-row lg:flex-col gap-4 md:gap-6 mt-0 sm:mt-6 md:mt-8 lg:mt-0">
          {/* Order Card */}
          <div className="bg-background mt-8 sm:mt-0 rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <h3 className="text-text-primary text-base font-medium mb-2">Your Total Order</h3>
                <div className="flex items-center justify-between">
                  <button className="px-4 py-2 bg-[#015C67] text-white text-sm rounded-lg font-medium">
                    View Orders
                  </button>
                  <p className="text-[40px] font-bold text-[#015C67]">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* Get Number Card */}
          <div className="bg-background rounded-[20px] px-6 pt-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1">
            <div className="flex items-end justify-between mt-auto">
              <div className="">
                <h3 className="text-text-primary text-lg font-medium mb-2">Get Number</h3>
                <p className="text-text-secondary text-[11px] mb-4">
                  Get phone number to receive OTP<br />
                  for short term or long term use.
                </p>
                <button className="mb-4 px-5 py-2.5 bg-[#015C67] text-white text-sm rounded-lg font-medium">
                  Buy Number Now
                </button>
              </div>
              <img 
                src="/number-illustration.png" 
                alt="Get Number" 
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection; 