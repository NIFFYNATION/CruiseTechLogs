import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import NotificationDropdown from '../common/NotificationDropdown';
import AccountDropdown from '../common/AccountDropdown';
import { fetchUserProfile } from '../../services/userService'; // Use fetchUserProfile

const DashboardHeader = () => {
  const { toggleSidebar, isCollapsed } = useSidebar();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const [user, setUser] = useState(null); // State to store user details

  // Fetch user record from fetchUserProfile
  useEffect(() => {
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
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
    <div className={`border-b border-quaternary md:border-[#D9D9D9] fixed top-0 right-0 ${isCollapsed ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[260px]'} h-[80px] bg-background md:bg-bgLayout z-20 transition-all duration-300`}>
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
          <img 
                src="/images/CruiseTech-2.svg" 
                alt="CruiseTech" 
                className="h-8" 
              />
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
          {/* Notification Bell */}
          <div className="relative">
            <button
              ref={bellRef}
              className="relative p-2 bg-quaternary-light rounded-full"
              onClick={() => setShowDropdown((v) => !v)}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-quaternary md:w-[22px] md:h-[22px]"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"/>
            </button>
            {showDropdown && (
              <div ref={dropdownRef}>
                <NotificationDropdown 
                  onMarkRead={() => {}} 
                  onClose={() => setShowDropdown(false)}
                />
              </div>
            )}
          </div>

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
                  onEditProfile={() => {/* handle edit */}}
                  onLogout={() => {/* handle logout */}}
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