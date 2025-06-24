import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaWhatsapp,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useSidebar } from '../../contexts/SidebarContext';
import { motion, AnimatePresence } from "framer-motion";
import { isUserLoggedIn, logoutUser } from '../../controllers/userController'; // Import userController
import { fetchUserProfile } from '../../services/userService'; // Import user profile fetch
import UserAvatar from '../common/UserAvatar'; // Import UserAvatar
import '../../styles/scrollbar.css'; // Import the global scrollbar CSS

const MenuItem = ({ imageSrc, text, to }) => {
  const { isCollapsed, isMobile, setIsCollapsed } = useSidebar();
  const location = useLocation();
  
  const handleClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={handleClick}
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'mx-2'} font-semibold gap-3 px-6 py-4 text-[15px] 
        ${isActive 
          ? 'text-quaternary bg-quaternary-light' 
          : 'text-black/80 hover:text-quaternary hover:bg-quaternary-light'
        } 
        rounded-lg group transition-colors`}
    >
      <div 
        className={`w-5 h-5 transition-colors ${
          isActive ? 'bg-quaternary' : 'bg-black/50 group-hover:bg-quaternary'
        }`}
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
  open: { 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1.2
    }
  },
  closed: { 
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1.2
    }
  }
};

const overlayVariants = {
  open: { 
    opacity: 1,
    pointerEvents: "auto",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  closed: { 
    opacity: 0,
    pointerEvents: "none",
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1.2
    }
  })
};

const Sidebar = () => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  // --- User details state ---
  const [user, setUser] = useState(null); // null until loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always fetch from API on mount/reload
    fetchUserProfile()
      .then(data => {
        setUser({
          name: (data?.first_name && data?.last_name)
            ? `${data.first_name} ${data.last_name}`
            : (data?.fullName || 'User'),
          email: data?.email || '',
          avatar: data?.profile_image
            ? data.profile_image
            : (data?.avatar || '/icons/female.svg'),
          stage: data?.stage || { name: 'Level 1' },
          percentage: typeof data?.percentage === 'number' ? data.percentage : 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setUser({
          name: 'User',
          email: '',
          avatar: '/icons/female.svg',
          stage: { name: 'Level 1' },
          percentage: 0,
        });
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    if (isMobile) {
      toggleSidebar();
    }
    logoutUser();
    navigate('/login');
  };

  // Menu items for animation mapping
  const dashboardMenu = [
    { imageSrc: "/icons/home.svg", text: "Home", to: "/dashboard" },
    { imageSrc: "/icons/manage-numbers.svg", text: "Manage Numbers", to: "/dashboard/manage-numbers" },
    { imageSrc: "/icons/buy-number.svg", text: "Buy Number", to: "/dashboard/buy-numbers" },
    { imageSrc: "/icons/social-media.svg", text: "Buy Social Accounts", to: "/dashboard/accounts" },
    { imageSrc: "/icons/checklist.png", text: "Manage Social Accounts", to: "/dashboard/manage-orders" },
  ];
  const transactionsMenu = [
    { imageSrc: "/icons/wallet.svg", text: "Wallet", to: "/dashboard/wallet" },
    { imageSrc: "/icons/transactions.svg", text: "Transactions", to: "/dashboard/transactions" },
    { imageSrc: "/icons/api-key.svg", text: "API Key", to: "/dashboard/api-page" },
  ];
  const userGuideMenu = [
    { imageSrc: "/icons/settings.svg", text: "Profile Settings", to: "/dashboard/profile-settings" },
    { imageSrc: "/icons/help.svg", text: "Help Center", to: "/dashboard/help-center" },
  ];

  if (loading) {
    return null;
  }

  return (
    <>
      {/* Dark overlay for mobile */}
      <AnimatePresence>
      {isMobile && !isCollapsed && (
        <motion.div
          className="fixed inset-0 z-90 lg:hidden bg-black/10 backdrop-blur-xs border border-black/10"
          onClick={toggleSidebar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>

      
      <motion.aside
       className={`sidebar-scrollbar fixed left-0 top-0 h-screen 
          ${isCollapsed ? 'w-[80px]' : 'w-[270px]'} 
          bg-background z-100 overflow-y-auto 
          bg-gradient-to-br from-rose-50/20 to-stone-50
          ${isMobile ? 'backdrop-blur-md bg-white/50  bg-gradient-to-br from-rose-50/20 to-stone-50 border border-white/20' : ''}`}
        initial="closed"
        animate={isMobile && isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
      >
        {/* Logo and Close Button Container */}
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4 flex items-center justify-center`}>
          {/* Logo */}
          {isCollapsed ? (
           <Link to="/">
             <img 
              src="/images/CruiseTech-1.svg" 
              alt="CruiseTech Icon" 
              className="h-8 w-8 mx-auto" 
            />
           </Link>
          ) : (
            <div className="flex items-center justify-end md:justify-between md:justify-center w-full">
              <Link to="/">
              <img 
                src="/images/CruiseTech-2.svg" 
                alt="CruiseTech" 
                className="h-8 hidden md:flex" 
              />
              </Link>
            
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
          {/* Use UserAvatar reusable component */}
          <UserAvatar
            src={user.avatar}
            alt={user.name}
            size={isCollapsed ? 48 : 96}
            showLevel={!isCollapsed}
            level={user.stage?.name}
            className="mb-0"
          />

          {/* Name and Email - Only show when not collapsed */}
          {!isCollapsed && (
            <>
              <h3 className="text-lg font-semibold text-text-secondary mb-1 mt-8">
                {user.name}
              </h3>
              <p className="text-sm font-semibold text-black/80">
                {user.email}
              </p>
              
             
            </>
          )}
        </motion.div>

        {/* Dashboard Section */}
        <div className="">
          <SectionTitle title="Dashboard" />
          <nav>
            {dashboardMenu.map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: "var(--color-quaternary-light)",
                  transition: { duration: 0.2 }
                }}
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
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: "var(--color-quaternary-light)",
                  transition: { duration: 0.2 }
                }}
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
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: "var(--color-quaternary-light)",
                  transition: { duration: 0.2 }
                }}
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
              href="https://whatsapp.com/channel/0029Vb9rsBW0LKZKBGTI940l" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-success rounded-lg hover:bg-[#5FD66933] transition-colors"
              title="Join our WhatsApp Channel"
            >
              <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
            </a>
          ) : (
            <a
              href="https://whatsapp.com/channel/0029Vb9rsBW0LKZKBGTI940l"
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
            onClick={handleLogout}
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