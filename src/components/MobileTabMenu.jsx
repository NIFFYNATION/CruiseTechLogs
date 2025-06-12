import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: 'none' },
  visible: { opacity: 1, pointerEvents: 'auto' },
};

const menuVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit: { y: 50, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const MobileTabMenu = ({ onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 bg-black/10 z-50 backdrop-blur-sm"
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
    />
    <motion.div
      className="fixed left-1/2 bottom-20 z-50 -translate-x-1/2 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      exit="exit" // Reverse animation on close
      variants={menuVariants}
    >
      {/* Card */}
      <div className="bg-gray rounded-xl py-15 px-4 w-[90vw] max-w-xl relative overflow-visible  shadow-lg shadow-[#FA5A15F2]/20">
        <div className="grid grid-cols-3 gap-y-6 gap-x-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center"
              onClick={onClose}
            >
              <div
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow"
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-5 h-5 [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]"
                />
              </div>
              <span className="text-black/80 text-xs text-center font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Arrow */}
      <div className="w-0 h-20 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[10px] border-t-[#ff8c1a] -mt-0 rounded-b-full" />
    </motion.div>
  </AnimatePresence>
);

export default MobileTabMenu;
