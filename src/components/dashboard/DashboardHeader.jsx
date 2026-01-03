import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import NotificationDropdown from '../common/NotificationDropdown';
import AccountDropdown from '../common/AccountDropdown';
import { fetchUserProfile } from '../../services/userService'; // Use fetchUserProfile
import { logoutUser } from '../../controllers/userController'; // Import logoutUser
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchNotificationCount } from '../../services/notificationService';
import eventBus from '../../utils/eventBus';
import { Link } from 'react-router';


const DashboardHeader = () => {
  const { toggleSidebar, isCollapsed } = useSidebar();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const [user, setUser] = useState(null); // State to store user details
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const isAnyDrawerOpen = showNotificationDropdown || showAccountDropdown;
    eventBus.dispatch(isAnyDrawerOpen ? 'drawer:open' : 'drawer:close');
  }, [showNotificationDropdown, showAccountDropdown]);

  const refreshNotifCount = () => {
    fetchNotificationCount().then(setNotificationCount);
  };

  // Fetch user record from fetchUserProfile
  useEffect(() => {
    // Always fetch from API on mount/reload
    fetchUserProfile()
      .then(data => {
        setUser({
          ...data,
          profile_image: data?.profile_image || '/icons/female.svg',
          first_name: data?.first_name || 'User',
        });
      })
      .catch(() => {
        setUser({
          profile_image: '/icons/female.svg',
          first_name: 'User',
          email: '',
        });
      });
    refreshNotifCount(); // Initial fetch

    const interval = setInterval(refreshNotifCount, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Hide notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    }
    if (showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationDropdown]);

  // Hide account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowAccountDropdown(false);
      }
    }
    if (showAccountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountDropdown]);

  return (
    <div className={`border-b border-quaternary md:border-[#D9D9D9] fixed top-0 right-0 ${isCollapsed ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[270px]'} h-[80px] bg-background md:bg-bgLayout z-20 transition-all duration-300`}>
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className='flex items-center flex-1 gap-2 md:gap-6'>
          {/* Left Side - Menu Button */}
          <button 
            onClick={toggleSidebar}
            className="p-2 "
          >
             <img 
                src="/icons/tabler_menu.svg" 
                alt="CruiseTech" 
                className="h-8" 
              />
          </button>

          <div className='md:hidden m-auto'>
            <Link to="/">
            <img 
                src="/images/CruiseTech-2.svg" 
                alt="CruiseTech" 
                className="h-8" 
              />
            </Link>
          
          </div>
          {/* Middle - Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-2 md:mx-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Dashboard" 
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-bgLayout font-bold text-text-primary text-sm border border-[#D9D9D9] focus:outline-none focus:border-quaternary"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Notification & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Icon */}
          <button
            onClick={() => setShowNotificationDropdown((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-200"
          >
            <img src="/icons/bell.svg" alt="Notifications" className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-quinary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotificationDropdown && (
            <div ref={dropdownRef}>
              <NotificationDropdown
                onMarkRead={() => console.log('Marking all as read...')}
                onClose={() => {
                  setShowNotificationDropdown(false);
                  refreshNotifCount();
                }}
              />
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              ref={profileRef}
              className="flex items-center gap-2 bg-background border border-primary rounded-full px-1 md:px-2 py-1 cursor-pointer"
              onClick={() => setShowAccountDropdown((v) => !v)}
            >
              <img 
                src={user?.profile_image || "/icons/female.svg"}
                alt={user?.first_name || "User"} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-primary text-sm font-medium">{user?.first_name || "User"}</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-gray-600 hidden md:block"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            {showAccountDropdown && (
              <div ref={accountDropdownRef}>
                <AccountDropdown
                  user={user} // Pass user details to AccountDropdown
                  onEditProfile={() => {
                    setShowAccountDropdown(false);
                    navigate('/dashboard/profile-settings');
                  }}
                  onLogout={async () => {
                    setShowAccountDropdown(false);
                    await logoutUser();
                  }}
                  onKnowMore={() => {/* handle know more */}}
                  onClose={() => setShowAccountDropdown(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;