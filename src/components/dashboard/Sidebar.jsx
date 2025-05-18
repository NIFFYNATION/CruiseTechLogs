import React from 'react';
import { Link } from 'react-router-dom';
import { 

  FaWhatsapp,
  FaSignOutAlt,

} from 'react-icons/fa';
import { useSidebar } from '../../contexts/SidebarContext';

const MenuItem = ({ imageSrc, text, to }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <Link 
      to={to} 
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'mx-2'} gap-3 px-6 py-2 text-[15px] text-text-secondary hover:text-quaternary hover:bg-quaternary-light rounded-lg group`}
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
    <h2 className="text-xs font-semibold text-gray-400 px-6 py-3 uppercase">
      {title}
    </h2>
  );
};

const Sidebar = () => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Dark overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => toggleSidebar()}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-screen 
        ${isCollapsed ? 'w-[80px] -translate-x-full lg:translate-x-0' : 'w-[260px]'} 
        bg-background overflow-y-auto transition-all duration-300 z-40
        lg:translate-x-0 ${!isCollapsed ? 'translate-x-0' : ''}`}
      >
        {/* Logo and Close Button Container */}
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4 flex items-center justify-between`}>
          {/* Logo */}
          {isCollapsed ? (
            <img 
              src="/images/CruiseTech-1.png" 
              alt="CruiseTech Icon" 
              className="h-8 w-8 mx-auto" 
            />
          ) : (
            <div className="flex items-center justify-between w-full">
              <img 
                src="/CruiseTech-2.png" 
                alt="CruiseTech" 
                className="h-8" 
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
                  className="text-gray-500"
                >
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-8 flex flex-col items-center text-center`}>
          {/* Avatar with orange border */}
          <div className="relative">
            <div className={`${isCollapsed ? 'w-12 h-12' : 'w-24 h-24'} rounded-full border-[3px] border-quaternary p-0.5 transition-all duration-300`}>
              <img 
                src="/avatar.png" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Level Badge - Only show when not collapsed */}
            {!isCollapsed && (
              <div className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 w-28 justify-center">
                <img src="/level-badge.png" alt="Level" className="w-4 h-4" />
                <span className="text-xs font-medium">Level 1</span>
              </div>
            )}
          </div>

          {/* Name and Email - Only show when not collapsed */}
          {!isCollapsed && (
            <>
              <h3 className="text-lg font-semibold text-text-secondary mb-1 mt-8">
                Fortune Ivo
              </h3>
              <p className="text-sm text-text-secondary">
                ivofortune35@gmail.com
              </p>
            </>
          )}
        </div>

        {/* Dashboard Section */}
        <div className="mt-4">
          <SectionTitle title="Dashboard" />
          <nav>
            <MenuItem imageSrc="/icons/home.png" text="Home" to="/dashboard" />
            <MenuItem imageSrc="/icons/manage-numbers.png" text="Manage Numbers" to="/dashboard/manage-numbers" />
            <MenuItem imageSrc="/icons/buy-number.png" text="Buy Number" to="/dashboard/buy-number" />
            <MenuItem imageSrc="/icons/social-media.png" text="Social Media Accounts" to="/dashboard/social-media" />
          </nav>
        </div>

        {/* Transactions Section */}
        <div className="mt-4">
          <SectionTitle title="Transactions" />
          <nav>
            <MenuItem imageSrc="/icons/wallet.png" text="Wallet" to="/dashboard/wallet" />
            <MenuItem imageSrc="/icons/transactions.png" text="Transactions" to="/dashboard/transactions" />
            <MenuItem imageSrc="/icons/api-key.png" text="API Key" to="/dashboard/api-key" />
          </nav>
        </div>

        {/* User Guide Section */}
        <div className="mt-4">
          <SectionTitle title="User Guide" />
          <nav>
            <MenuItem imageSrc="/icons/settings.png" text="Profile Settings" to="/dashboard/settings" />
            <MenuItem imageSrc="/icons/help.png" text="Help Center" to="/dashboard/help"/>
          </nav>
        </div>

        {/* WhatsApp Channel */}
        {!isCollapsed && (
          <div className="px-6 pt-6 pb-4">
            <div className="bg-[#E7F7E8] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-[#25D366] text-xl" />
                <div>
                  <div className="text-sm font-medium">Join our WhatsApp Channel</div>
                  <div className="text-xs text-gray-500">for news and update</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} pb-6`}>
          <button className={`w-full bg-quaternary hover:bg-quaternary-dark text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${isCollapsed ? 'px-2' : ''}`}>
            <FaSignOutAlt />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 