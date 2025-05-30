import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MobileTabMenu from './MobileTabMenu';

// Use image paths for icons
const tabs = [
  { name: 'Home', path: '/dashboard', icon: '/icons/tabHome.svg' },
  { name: 'Number', path: '/dashboard/buy-number', icon: '/icons/tabBuyNum.svg' },
  { name: 'Accounts', path: '/accounts', icon: '/icons/tabSocial.svg' },
  { name: 'Wallet', path: '/wallet', icon: '/icons/tabWallet.svg' },
];

const Tabs = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide the FAB menu when route changes
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Popup Menu */}
      {menuOpen && <MobileTabMenu onClose={() => setMenuOpen(false)} />}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md">
        <div className="relative flex items-center justify-between bg-background rounded-full shadow-lg px-4 py-3">
          {/* Central FAB */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 ">
            <button
              className="p-0 "
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              <img className="w-18 h-18 rounded-full" src="/icons/mobileTab.svg" alt="mobileTab" />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex justify-between w-full">
            {tabs.map((tab, idx) => {
              // Leave space for the FAB in the center
              if (idx === 2) {
                return (
                  <React.Fragment key={tab.name}>
                    <TabItem tab={tabs[0]} isActive={location.pathname === tabs[0].path} />
                    <TabItem tab={tabs[1]} isActive={location.pathname === tabs[1].path} />
                    <div className="w-16" /> {/* Spacer for FAB */}
                    <TabItem tab={tabs[2]} isActive={location.pathname === tabs[2].path} />
                    <TabItem tab={tabs[3]} isActive={location.pathname === tabs[3].path} />
                  </React.Fragment>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// Use <img> for icons
const TabItem = ({ tab, isActive }) => (
  <Link
    to={tab.path}
    className={`flex flex-col items-center flex-1 ${
      isActive ? 'text-orange-500 font-bold' : 'text-gray-400'
    }`}
  >
    <img
      src={tab.icon}
      alt={tab.name}
      className={`h-6 w-6 mb-1 transition-all duration-200 ${
        isActive
          ? '[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]'
          : 'grayscale'
      }`}
    />
    <span className={`text-xs ${isActive ? 'font-bold' : 'font-normal'}`}>{tab.name}</span>
  </Link>
);

export default Tabs;