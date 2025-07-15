import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add navigation for redirection
import WelcomeSection from '../components/dashboard/WelcomeSection';
import ProductCard from '../components/dashboard/ProductCard';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import ProductSection from '../components/dashboard/ProductSection';
import { isUserLoggedIn, fetchUserDetails } from '../controllers/userController'; // Import userController
import Transactions from '../components/dashboard/wallet/Transactions';
import { useUser } from '../contexts/UserContext';
import Joyride from 'react-joyride';



const Dashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

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
  }, []);

  const DEBUG_ALWAYS_SHOW_TOUR = false;

  useEffect(() => {
    if (!user || !user.email) return;
    if (DEBUG_ALWAYS_SHOW_TOUR) {
      setRunTour(true);
      // Optionally, always show welcome modal too for debug
      setShowWelcome(true);
      return;
    }
    const key = `welcome_popup_last_shown_${user.email}`;
    const tourKey = `dashboard_tour_last_shown_${user.email}`;
    const lastShown = localStorage.getItem(key);
    const lastTour = localStorage.getItem(tourKey);
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    if (!lastShown || now - Number(lastShown) > oneMonth) {
      setShowWelcome(true);
      localStorage.setItem(key, now.toString());
    } else if (!lastTour || now - Number(lastTour) > oneMonth) {
      setRunTour(true);
      localStorage.setItem(tourKey, now.toString());
    }
  }, [user]);

  // When welcome modal closes, start the tour and set the tour timestamp
  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setRunTour(true);
    if (user && user.email) {
      const tourKey = `dashboard_tour_last_shown_${user.email}`;
      localStorage.setItem(tourKey, Date.now().toString());
    }
  };

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
      <WelcomeSection />
      {/* Transactions Table */}
      <div className="transactions-tour">
        <Transactions isRecent={true} title='Recent Transactions'/>
      </div>
    </>
  );
};

export default Dashboard;