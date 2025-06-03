import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add navigation for redirection
import { 
  FaWhatsapp,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useSidebar } from '../../contexts/SidebarContext';
import { motion, AnimatePresence } from "framer-motion";
import { isUserLoggedIn, logoutUser } from '../../controllers/userController'; // Import userController

const MenuItem = ({ imageSrc, text, to }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <Link 
      to={to} 
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'mx-2'} font-semibold gap-3 px-6 py-4 text-[15px] text-text-secondary hover:text-quaternary hover:bg-quaternary-light rounded-lg group`}
    >
      <div 
        className="w-5 h-5 bg-text-secondary group-hover:bg-quaternary transition-colors"
        style={{
          WebkitMask: `url(${imageSrc}) center center / contain no-repeat`,
          mask: `url(${imageSrc}) center center / contain no-repeat`
        }}
      />
      {!isCollapsed && <span>{text}</span>}
    </Link>
  );
};

const SectionTitle = ({ title }) => {
  const { isCollapsed } = useSidebar();
  
  if (isCollapsed) return null;
  
  return (
    <h2 className="text-sm font-bold text-text-secondary px-6 py-3 uppercase">
      {title}
    </h2>
  );
};

const sidebarVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const overlayVariants = {
  open: { opacity: 1, pointerEvents: "auto" },
  closed: { opacity: 0, pointerEvents: "none" },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 },
  }),
};

const Sidebar = () => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate();


  const handleLogout = () => {
    logoutUser(); // Call logout function
    navigate('/login'); // Redirect to login page
  };

  // Menu items for animation mapping
  const dashboardMenu = [
    { imageSrc: "/icons/home.svg", text: "Home", to: "/dashboard" },
    { imageSrc: "/icons/manage-numbers.svg", text: "Manage Numbers", to: "/dashboard/manage-numbers" },
    { imageSrc: "/icons/buy-number.svg", text: "Buy Number", to: "/dashboard/buy-numbers" },
    { imageSrc: "/icons/social-media.svg", text: "Social Media Accounts", to: "/dashboard/social-media-accounts" },
  ];
  const transactionsMenu = [
    { imageSrc: "/icons/wallet.svg", text: "Wallet", to: "/dashboard/wallet" },
    { imageSrc: "/icons/transactions.svg", text: "Transactions", to: "/dashboard/transactions" },
    { imageSrc: "/icons/api-key.svg", text: "API Key", to: "/dashboard/api-key" },
  ];
  const userGuideMenu = [
    { imageSrc: "/icons/settings.svg", text: "Profile Settings", to: "/dashboard/settings" },
    { imageSrc: "/icons/help.svg", text: "Help Center", to: "/dashboard/help" },
  ];

  return (
    <>
      {/* Dark overlay for mobile */}
      <AnimatePresence>
        {isMobile && !isCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleSidebar}
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
          />
        )}
      </AnimatePresence>
      
      <motion.aside
        className={`fixed left-0 top-0 h-screen 
          ${isCollapsed ? 'w-[80px] -translate-x-full lg:translate-x-0' : 'w-[270px] pb-32'} 
          bg-background overflow-y-auto transition-all duration-300 z-40
          lg:translate-x-0 ${!isCollapsed ? 'translate-x-0' : ''}`}
        initial={isMobile && isCollapsed ? "closed" : "open"}
        animate={isMobile && isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
      >
        {/* Logo and Close Button Container */}
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4 flex items-center justify-between`}>
          {/* Logo */}
          {isCollapsed ? (
            <img 
              src="/images/CruiseTech-1.svg" 
              alt="CruiseTech Icon" 
              className="h-8 w-8 mx-auto" 
            />
          ) : (
            <div className="flex items-center justify-end md:justify-between md:justify-center w-full">
              <img 
                src="/images/CruiseTech-2.svg" 
                alt="CruiseTech" 
                className="h-8 hidden md:flex" 
              />
              {/* Close Button - Only show on mobile */}
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-text-grey"
                >
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <motion.div
          className={`${isCollapsed ? 'px-2' : 'px-6'} py-8 flex flex-col items-center text-center`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Avatar with orange border */}
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className={`${isCollapsed ? 'w-12 h-12' : 'w-24 h-24'} rounded-full border-[4px] border-quaternary transition-all duration-300`}>
              <img 
                src="/icons/female.svg" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Level Badge - Only show when not collapsed */}
            {!isCollapsed && (
              <div className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 w-25 justify-center">
                <img src="/level-badge.png" alt="Level" className="w-4 h-4" />
                <span className="text-xs font-medium">Level 1</span>
              </div>
            )}
          </motion.div>

          {/* Name and Email - Only show when not collapsed */}
          {!isCollapsed && (
            <>
              <h3 className="text-lg font-semibold text-text-secondary mb-1 mt-8">
                Fortune Ivo
              </h3>
              <p className="text-sm font-semibold text-text-grey">
                ivofortune35@gmail.com
              </p>
            </>
          )}
        </motion.div>

        {/* Dashboard Section */}
        <div className="mt-4">
          <SectionTitle title="Dashboard" />
          <nav>
            {dashboardMenu.map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                whileHover={{ scale: 1.06, backgroundColor: "var(--color-quaternary-light)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <MenuItem {...item} />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Transactions Section */}
        <div className="mt-4">
          <SectionTitle title="Transactions" />
          <nav>
            {transactionsMenu.map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                whileHover={{ scale: 1.06, backgroundColor: "var(--color-quaternary-light)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <MenuItem {...item} />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* User Guide Section */}
        <div className="mt-4">
          <SectionTitle title="User Guide" />
          <nav>
            {userGuideMenu.map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                whileHover={{ scale: 1.06, backgroundColor: "var(--color-quaternary-light)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <MenuItem {...item} />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* WhatsApp Channel */}
        <div className="px-4 pt-6 pb-4">
          {isCollapsed ? (
            <a
              href="https://whatsapp.com/your-channel-link" // <-- Replace with your actual channel link
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-success rounded-lg hover:bg-[#5FD66933] transition-colors"
              title="Join our WhatsApp Channel"
            >
              <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
            </a>
          ) : (
            <a
              href="https://whatsapp.com/your-channel-link" // <-- Replace with your actual channel link
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-[#5FD6691A] rounded-lg p-4 w-full hover:bg-[#5FD66933] transition-colors">
                <div className="flex items-center gap-2">
                  <img className="self-start" src="/icons/whatsapp.svg" alt="WhatsApp" />
                  <div>
                    <h3 className="text-xs font-bold mb-3">Join our WhatsApp Channel</h3>
                    <p className="text-xs text-text-grey">for news and update</p>
                  </div>
                </div>
              </div>
            </a>
          )}
        </div>

        {/* Logout Button */}
        <div className={`${isCollapsed ? 'px-4' : 'px-6'} pb-6 `}>
          <button
            onClick={handleLogout} // Attach logout handler
            className={`w-full bg-quinary hover:bg-quaternary text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${isCollapsed ? 'px-2' : ''}`}
          >
            <img className='' src="/icons/logout.svg" alt="Logout Icon" />

            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;