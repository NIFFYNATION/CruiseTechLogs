import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MobileTabMenu from './MobileTabMenu';
import { motion } from 'framer-motion';
import eventBus from '../utils/eventBus';

// Use image paths for icons
const tabs = [
  { name: 'Home', path: '/dashboard', icon: '/icons/tabHome.svg' },
  { name: 'Buy No.', path: '/dashboard/buy-numbers', icon: '/icons/tabBuyNum.svg' },
  { name: 'Buy Acct.', path: '/dashboard/accounts', icon: '/icons/tabSocial.svg' },
  { name: 'Wallet', path: '/dashboard/wallet', icon: '/icons/tabWallet.svg' },
];

const Tabs = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Hide the FAB menu when route changes
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleDrawerOpen = () => setIsHidden(true);
    const handleDrawerClose = () => setIsHidden(false);

    eventBus.on('drawer:open', handleDrawerOpen);
    eventBus.on('drawer:close', handleDrawerClose);

    return () => {
      eventBus.remove('drawer:open', handleDrawerOpen);
      eventBus.remove('drawer:close', handleDrawerClose);
    };
  }, []);

  // Hide on shop pages or if explicitly hidden
  if (isHidden || !location.pathname.startsWith('/dashboard')) return null;

  return (
    <>



      {/* Internal CSS */}
      <style>{`
      .cutout-top-circle {
        -webkit-mask: radial-gradient(
          circle 30px at calc(50% + 30px) 0px,
          transparent 0px,
          transparent 29px,
           rgba(0, 0, 0, 0.2) 30px,
          black 31px
        );
        mask: radial-gradient(
          circle 30px at calc(50% + 6px) 0px,
          transparent 0px,
          transparent 35px,
           rgba(0, 0, 0, 0.2) 30px,
          black 30px
        );
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        overflow: hidden;
      }
    `}</style>
  
      {/* Popup Menu */}
      {menuOpen && <MobileTabMenu onClose={() => setMenuOpen(false)} />}
  
      <div className="fixed bottom-4 left-0 right-0 mx-auto z-50 w-[97vw] max-w-md dashboard-tabmenu">
      <div className="absolute bottom-9 left-[calc(50%+35px)] -translate-x-1/2 z-10">
            <motion.button
              className="p-0 "
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: menuOpen ? 135 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <img className="w-14 h-14 rounded-full" src="/icons/mobileTab.svg" alt="mobileTab" />
              </motion.div>
            </motion.button>
          </div>
        <div className="relative flex items-center justify-between bg-[#f7f5f2]/98 border-1 border-black/10 rounded-full shadow-lg px-4 py-3 cutout-top-circle">
          {/* Central FAB */}
  
  
          {/* Tabs */}
          <div className="flex justify-between w-full">
            {tabs.slice(0, 2).map(tab => (
              <TabItem key={tab.path} tab={tab} isActive={location.pathname === tab.path} />
            ))}
            <div className="w-16" /> {/* Spacer for FAB */}
            {tabs.slice(2).map(tab => (
              <TabItem key={tab.path} tab={tab} isActive={location.pathname === tab.path} />
            ))}
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
