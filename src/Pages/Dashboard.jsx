import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import ProductCard from '../components/dashboard/ProductCard';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import ProductSection from '../components/dashboard/ProductSection';
import { isUserLoggedIn, fetchUserDetails } from '../controllers/userController'; // Import userController
import Transactions from '../components/dashboard/wallet/Transactions';
import { shopApi } from '../shop/services/api';
import { useUser } from '../contexts/UserContext';
import Joyride from 'react-joyride';



const Dashboard = () => {
  const [runTour, setRunTour] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [unresolvedDisputes, setUnresolvedDisputes] = useState([]);

  // Joyride steps
  const tourSteps = [
    {
      target: 'body',
      placement: 'center',
      title: '🎉 Ta-da! We Gave It a Glow-Up',
      content: (
        <span>
          <span className="animate-bounce inline-block mr-2">✨</span>
          Designed for speed, ease, and better service. Let us give you a quick tour.
        </span>
      ),
      disableBeacon: true,
    },
    {
      target: '.dashboard-sidebar',
      title: '🧭 Sidebar',
      content: (
        <span>
          <span className="animate-pulse inline-block mr-2">🗂️</span>
          Use the sidebar to navigate all dashboard sections.
        </span>
      ),
    },
    {
      target: '.user-balance',
      title: '💸 Your Balance',
      content: (
        <span>
          See your current balance here and also add fund.
        </span>
      ),
    },
    {
      target: '.dashboard-buy-number',
      title: 'Buy Number',
      content: (
        <span>
          <span className="animate-spin inline-block mr-2">🔢</span>
          Get a phone number for OTP or long-term use.
        </span>
      ),
    },
    {
      target: '.buy-account-tour',
      title: '🛒 Buy Account',
      content: (
        <span>
          <span className="animate-bounce inline-block mr-2">🚀</span>
          Buy social media accounts quickly and easily with our improved flow.
        </span>
      ),
    },
    {
      target: '.dashboard-tabmenu',
      title: '🗂️ Tab Menu',
      content: (
        <span>
          <span className="animate-bounce inline-block mr-2">📱</span>
          Use this menu for quick navigation on mobile.
        </span>
      ),
    },
    {
      target: 'button.p-2',
      title: 'More Options',
      content: (
        <span>
          To see all menu and more options click here
        </span>
      ),
    }
  ];

  useEffect(() => {
    // On dashboard mount, fetch latest user details from API
    fetchUserDetails();
    // Show tour only once per device
    const tourKey = 'dashboard_tour_shown_v1';
    if (!localStorage.getItem(tourKey)) {
      setRunTour(true);
      localStorage.setItem(tourKey, 'true');
    }
    const loadDisputes = async () => {
      try {
        const res = await shopApi.getUnresolvedDisputes();
        if (res.status === 'success' && Array.isArray(res.data)) {
          setUnresolvedDisputes(res.data);
        } else {
          setUnresolvedDisputes([]);
        }
      } catch {
        setUnresolvedDisputes([]);
      }
    };
    loadDisputes();
  }, []);

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#FF6B00',
            textColor: '#222',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: 24,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            // Add border for glass effect
            border: '1px solid rgba(255,255,255,0.3)',
            // Add blur
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '24px',
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            color: '#222',
            borderRadius: 24,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '24px',
          },
          overlay: {
            backgroundColor: 'rgba(30,30,40,0.25)', // keep this for a dim effect
            // REMOVE the blur from overlay:
            // backdropFilter: 'blur(2px)',
            // WebkitBackdropFilter: 'blur(2px)',
          },
          buttonNext: {
            backgroundColor: '#FF6B00',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 999,
            boxShadow: '0 2px 8px rgba(255,107,0,0.12)',
            transition: 'background 0.2s',
            padding: '10px 15px'
          },
          buttonBack: {
            color: '#FF6B00',
            fontWeight: 'bold',
            background: 'transparent',
          },
          buttonSkip: {
            color: '#FF6B00',
            fontWeight: 'bold',
            background: 'transparent',
          },
        }}
        callback={data => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setRunTour(false);
            if (data.status === 'finished') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }}
      />
       {unresolvedDisputes.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="mt-1 text-red-500">
            <span className="material-symbols-outlined text-lg">error</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-700 mb-1">
              You have unresolved shop order disputes
            </h3>
            <p className="text-xs text-red-600 mb-2">
              Please check your shop orders and respond to support so we can resolve your disputes.
            </p>
            <button
              onClick={() => navigate('/shop/dashboard')}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800"
            >
              Go to Shop Dashboard
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
      <WelcomeSection />
     
      {/* Transactions Table */}
      <div className="transactions-tour">
        <Transactions isRecent={true} title='Recent Transactions'/>
      </div>
    </>
  );
};

export default Dashboard;
