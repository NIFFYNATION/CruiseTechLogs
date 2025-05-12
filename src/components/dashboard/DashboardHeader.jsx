import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

const DashboardHeader = () => {
  const { toggleSidebar, isCollapsed } = useSidebar();

  return (
    <div className={`fixed top-0 right-0 ${isCollapsed ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[260px]'} h-[80px] bg-secondary z-20 transition-all duration-300`}>
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className='flex items-center flex-1 gap-2 md:gap-6'>
          {/* Left Side - Menu Button */}
          <button 
            onClick={toggleSidebar}
            className="p-2 bg-quaternary rounded-lg text-white hover:bg-quaternary-dark transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          {/* Middle - Search Bar */}
          <div className="flex-1 max-w-xl mx-2 md:mx-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Dashboard" 
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary text-text-primary text-sm border border-text-text-primary focus:outline-none focus:border-quaternary"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
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
          <button className="relative p-2 bg-quaternary-light rounded-full">
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
          </button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2 bg-background border border-primary rounded-full px-2 
            py-1 cursor-pointer">
            <img 
              src="/avatar.png" 
              alt="Fortune Ivo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden md:block text-primary text-sm font-medium">Fortune Ivo</span>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 