import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { name: 'Home', icon: '/icons/home.svg', path: '/dashboard' },
  { name: 'Manage Numbers', icon: '/icons/manage-numbers.svg', path: '/dashboard/manage-numbers' },
  { name: 'Buy Number', icon: '/icons/buy-number.svg', path: '/dashboard/buy-number' },
  { name: 'Wallet', icon: '/icons/wallet.svg', path: '/dashboard/wallet' },
  { name: 'Transactions', icon: '/icons/transactions.svg', path: '/dashboard/transactions' },
  { name: 'API Key', icon: '/icons/api-key.svg', path: '/dashboard/api-key' },
  { name: 'Profile Settings', icon: '/icons/settings.svg', path: '/dashboard/settings' },
  { name: 'Help Center', icon: '/icons/help.svg', path: '/dashboard/help' },
  { name: 'Social Media Accounts', icon: '/icons/social-media.svg', path: '/dashboard/social-media' },
];

const MobileTabMenu = ({ onClose }) => (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/30 z-50"
      onClick={onClose}
    />
    {/* Popup Menu */}
    <div className="fixed left-1/2 bottom-24 z-50 -translate-x-1/2 flex flex-col items-center">
      {/* Card */}
      <div className="bg-[#FA5A15F2] rounded-xl pt-6 pb-8 px-4 w-[90vw] max-w-xs shadow-lg relative overflow-visible"
      >
        <div className="grid grid-cols-3 gap-y-6 gap-x-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center"
              onClick={onClose}
            >
              <div
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-2 shadow"
               
              >
                <img  src={item.icon} alt={item.name} className="w-7 h-7 [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]" />
              </div>
              <span className="text-white text-xs text-center font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Arrow */}
      <div className="w-0 h-20 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-t-[40px] border-t-[#FF6B00] -mt-1" />
    </div>
  </>
);

export default MobileTabMenu;
