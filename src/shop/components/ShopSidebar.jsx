import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaWhatsapp,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useSidebar } from '../../contexts/SidebarContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from '../../controllers/userController';
import { fetchUserProfile } from '../../services/userService';
import UserAvatar from '../../components/common/UserAvatar';
import '../../styles/scrollbar.css';

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
          ? 'text-primary bg-primary/10'
          : 'text-black/80 hover:text-primary hover:bg-primary/10'
        } 
        rounded-lg group transition-colors`}
    >
      <div
        className={`w-5 h-5 transition-colors ${isActive ? 'bg-primary' : 'bg-black/50 group-hover:bg-primary'
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

const ShopSidebar = () => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

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

  const handleLogout = async () => {
    if (isMobile) {
      toggleSidebar();
    }
    await logoutUser();
  };

  // Menu items for Shop
  const shopMenu = [
    { imageSrc: "/icons/home.svg", text: "Dashboard", to: "/shop/dashboard" },
    { imageSrc: "/icons/orders.svg", text: "My Orders", to: "/shop/orders" },
    { imageSrc: "/icons/user.svg", text: "Addresses", to: "/shop/addresses" },
    { imageSrc: "/icons/cart.svg", text: "Browse Shop", to: "/shop/products" },
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
            className="fixed inset-0 z-[90] lg:hidden bg-black/10 backdrop-blur-sm border border-black/10"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>


      <motion.aside
        className={`sidebar-scrollbar h-screen 
          ${isMobile ? 'fixed left-0 top-0 z-[100]' : 'sticky top-0 z-40 shrink-0'}
          ${isCollapsed ? 'w-[80px]' : 'w-[270px]'} 
          bg-background overflow-y-auto 
          bg-gradient-to-br from-rose-50/20 to-stone-50
          ${isMobile ? 'backdrop-blur-md bg-white/50 border border-white/20' : ''}`}
        initial={false}
        animate={isMobile ? (isCollapsed ? "closed" : "open") : "open"}
        variants={isMobile ? sidebarVariants : {}}
      >
        {/* Logo and Close Button Container */}
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4 flex items-center justify-center`}>
          {/* Logo */}
          {isCollapsed ? (
            <Link to="/shop">
              <img
                src="/images/CruiseTech-1.svg"
                alt="CruiseTech Icon"
                className="h-8 w-8 mx-auto"
              />
            </Link>
          ) : (
            <div className="flex items-center justify-end md:justify-between md:justify-center w-full">
              <Link to="/shop">
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
                  <path d="M18 6L6 18M6 6l12 12" />
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

        {/* Shop Section */}
        <div className="">
          <SectionTitle title="Shop Menu" />
          <nav>
            {shopMenu.map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                whileHover={{
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
              >
                <MenuItem {...item} />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-8 px-6 pb-8">
          <motion.button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} 
              gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignOutAlt className="w-5 h-5" />
            {!isCollapsed && <span className="font-semibold">Log Out</span>}
          </motion.button>
        </div>

      </motion.aside>
    </>
  );
};

export default ShopSidebar;
