import React from 'react';
import {
  HomeIcon,
  PhoneIcon,
  UserGroupIcon,
  WalletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useLocation, Link } from 'react-router-dom';

const tabs = [
  { name: 'Home', path: '/dashboard', icon: HomeIcon },
  { name: 'Number', path: '/number', icon: PhoneIcon },
  { name: 'Accounts', path: '/accounts', icon: UserGroupIcon },
  { name: 'Wallet', path: '/wallet', icon: WalletIcon },
];

const Tabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md">
      <div className="relative flex items-center justify-between bg-background rounded-full shadow-lg px-4 py-3">
        {/* Central FAB */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 ">
          <button className="p-8 ">
            <img className='w-13 h-13 rounded-full ' src="icons/mobileTab.svg" alt="mobileTab" />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex justify-between w-full">
          {tabs.map((tab, idx) => {
            // Leave space for the FAB in the center
            if (idx === 2) {
              return (
                <React.Fragment key={tab.name}>
                  <TabItem tab={tabs[0]} isActive={currentPath === tabs[0].path} />
                  <TabItem tab={tabs[1]} isActive={currentPath === tabs[1].path} />
                  <div className="w-16" /> {/* Spacer for FAB */}
                  <TabItem tab={tabs[2]} isActive={currentPath === tabs[2].path} />
                  <TabItem tab={tabs[3]} isActive={currentPath === tabs[3].path} />
                  {/* Break out of map after rendering all */}
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

const TabItem = ({ tab, isActive }) => (
  <Link
    to={tab.path}
    className={`flex flex-col items-center flex-1 ${
      isActive ? 'text-orange-500 font-bold' : 'text-gray-400'
    }`}
  >
    <tab.icon className={`h-6 w-6 mb-1 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
    <span className={`text-xs ${isActive ? 'font-bold' : 'font-normal'}`}>{tab.name}</span>
  </Link>
);

export default Tabs;