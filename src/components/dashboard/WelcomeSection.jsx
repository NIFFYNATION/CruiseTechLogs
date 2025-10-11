import React, { useState, useEffect } from 'react';
import BalanceCard from './cards/BalanceCard'; // <-- Make sure this import exists and the file is present
import { useNavigate } from "react-router-dom";
import WhatsAppBanner from '../WhatsAppBanner';
import { useUser } from '../../contexts/UserContext';

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    // Get referral code from UserContext
    if (user && user.referral_code) {
      setReferralCode(user.referral_code);
    }
  }, [user]);
  return (
    <div className="mb-6 mt-6">
      {/* Welcome Text */}
      <h1 className="text-2xl font-semibold text-text-primary mb-4">Welcome back!</h1>
      {/* Refund Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-800">
          <p className="mb-1">
           We do not support fraud and are not responsible for bought product misuse.
          </p>
        </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Balance Card - Takes 2 columns */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2 h-full">
          <BalanceCard />
          {/* Referral Program Card - Desktop Only */}
          <div className="hidden md:block mt-4">
            <div className="bg-gradient-to-br from-primary-light to-orange-50 rounded-[15px] border-b-p border-b-2 px-6 pt-6 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-p text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h3 className="text-text-primary text-lg font-semibold mb-2">Referral Program</h3>
                  <p className="text-text-secondary text-sm mb-3">
                    Invite friends and earn rewards for every successful referral.
                  </p>
                  {referralCode && (
                    <div className="mb-3">
                      <p className="text-text-secondary text-xs mb-1 uppercase tracking-wide font-semibold">Your Code</p>
                      <p className="text-text-primary text-sm font-mono font-bold bg-white/50 px-3 py-2 rounded border">
                        {referralCode}
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => navigate("/dashboard/referrals")}
                    className="px-6 py-3 bg-p text-white text-sm rounded-full font-medium bg-primary hover:bg-quinary transition-colors">
                    Start Referring
                  </button>
                </div>
                <div className="w-24 h-24 flex items-center justify-center ml-4">
                  <svg className="w-16 h-16 text-p" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01 1l-2.7 3.6L12 10l2.5-2.5L16 10l.94-1.88L18.5 10l1.5 4.5V22h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm7.5 2c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* WhatsApp Banner - Mobile Only */}
          <div className="block md:hidden mt-4">
            <WhatsAppBanner />
          </div>
        </div>
        {/* Right Column Cards - Flex on tablet, stack on mobile and desktop */}
        <div className="flex flex-col md:flex-row lg:flex-col gap-4 md:gap-4 lg:gap-4 mt-4 sm:mt-0 md:mt-0 lg:mt-0 h-full">
          {/* Order Card */}  
          {/* <div className="bg-background hidden md:block mt-8 sm:mt-0 rounded-[15px] border-b-primary border-b-2 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <h3 className="text-text-primary text-base font-semibold mb-2">Your Total Order</h3>
                <div className="flex items-center justify-between">
                  <button className="px-4 py-2 bg-[#015C67] text-white text-sm rounded-full font-medium">
                    View Orders
                  </button>
                  <p className="text-[40px] font-bold text-[#015C67]">15</p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Rent Card - Combined Phone & Email */}
          <div className="bg-background rounded-[15px] border-b-primary border-b-2 px-6 pt-6 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1 dashboard-buy-number h-full">
            <div className="flex items-end justify-between mt-auto">
              <div className="flex-1">
                <div className="flex flex-row">
<div>
                 <h3 className="text-text-primary text-lg font-semibold mb-2">Rent Phone/Email</h3>
                <p className="text-text-secondary text-[11px] mb-4">
                  Rent phone numbers for OTP verification<br />
                  and temporary email addresses for secure needs.
                </p>
               </div>
                 <img 
                src="/number-illustration.png" 
                alt="Rent Services" 
                className="w-28 h-28 object-contain ml-4"
              />
                </div>
               
                <div className="flex flex-row gap-2 mb-4">
                  <button 
                   onClick={() => navigate("/dashboard/buy-numbers")}
                  className="px-5 py-4 bg-[#015C67] text-white text-sm rounded-full font-medium hover:bg-[#014a54] transition-colors">
                    Rent Number
                  </button>
                  <button 
                   onClick={() => navigate("/dashboard/buy-emails")}
                  className="px-5 py-4 bg-quinary text-white text-sm rounded-full font-medium hover:bg-blue-700 transition-colors">
                    Rent Email 
                  </button>
                </div>
              </div>
             
            </div>
          </div>
{/* buy account section */}
<div className="block px-6 rounded-[15px] border-b-quinary border-b-2 pl-6 pt-6 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1 buy-account-tour h-full"
            style={{
              background: `linear-gradient(rgba(255, 106, 0, 0.03), rgba(255, 107, 0, 0.1)), url('/background-buyaccounts.svg') no-repeat center center`,
              backgroundSize: '700px 500px'
            }}>
            <div className=" items-end justify-between mt-auto">
              <div className="">
                <h3 className="text-text-primary text-lg font-semibold mb-2">Buy Social Media Accounts</h3>
                <p className="text-text-secondary text-xs">
                Get long-lasting social media accounts from nearly every major platform—secure and ready for use.
                </p>
                
              </div>
              <div className='flex justify-between items-center p-0'>
              <button 
               onClick={() => navigate("/dashboard/accounts")}
              className="px-5 py-2.5 bg-quinary hover:bg-quaternary text-white text-sm rounded-full font-medium">
                  Buy Account
                </button>
              <img 
                src="/icons/holding-smartphone.svg" 
                alt="Buy Accounts Now" 
                className="w-28 h-28 object-contain"
              />
              </div>
            </div>
          </div>
          {/* Referral Program Card - Mobile Only */}
          <div className="block md:hidden bg-gradient-to-br from-quaternary-light to-orange-50 rounded-[15px] border-b-quaternary border-b-2 px-6 pt-6 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1 relative overflow-hidden h-full">
            <div className="absolute top-2 right-2">
              <span className="bg-quaternary text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <div className="">
                <h3 className="text-text-primary text-lg font-semibold mb-2">Referral Program</h3>
                 <p className="text-text-secondary text-[11px] mb-1">
                  Invite friends and earn rewards<br />
                  for every successful referral.
                </p>
                {referralCode && (
                  <div className="mb-3">
                    <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide"><b>Your Code</b></p>
                    <p className="text-text-primary text-sm font-mono font-bold bg-white/50 px-2 py-1 rounded border">
                      {referralCode}
                    </p>
                  </div>
                )}
               
                <button 
                 onClick={() => navigate("/dashboard/referrals")}
                className="mb-4 px-5 py-2.5 bg-quaternary text-white text-sm rounded-full font-medium hover:bg-quinary transition-colors">
                  Start Referring
                </button>
              </div>
              <div className="w-28 h-28 flex items-center justify-center">
                <svg className="w-16 h-16 text-quaternary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01 1l-2.7 3.6L12 10l2.5-2.5L16 10l.94-1.88L18.5 10l1.5 4.5V22h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm7.5 2c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;