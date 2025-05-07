import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaPhoneAlt, 
  FaUsers,
  FaWallet,
  FaListAlt,
  FaKey,
  FaCog,
  FaQuestionCircle,
  FaWhatsapp,
  FaSignOutAlt,
  FaPhoneVolume
} from 'react-icons/fa';
import { useSidebar } from '../../contexts/SidebarContext';

const MenuItem = ({ icon: Icon, text, to }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <Link 
      to={to} 
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'mx-2'} gap-3 px-6 py-2 text-[15px] text-text-secondary hover:text-quaternary hover:bg-quaternary-light rounded-lg`}
    >
      <Icon className="text-gray-600 text-lg hover:text-quaternary" />
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
  const { isCollapsed } = useSidebar();

  return (
    <aside className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-background overflow-y-auto transition-all duration-300`}>
      {/* Logo */}
      <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4`}>
        <img src="/CruiseTech-2.png" alt="CruiseTech" className="h-8 justify-self-center" />
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
          <MenuItem icon={FaHome} text="Home" to="/dashboard" />
          <MenuItem icon={FaPhoneAlt} text="Manage Numbers" to="/manage-numbers" />
          <MenuItem icon={FaPhoneVolume} text="Buy Number" to="/buy-number" />
          <MenuItem icon={FaUsers} text="Social Media Accounts" to="/social-media" />
        </nav>
      </div>

      {/* Transactions Section */}
      <div className="mt-4">
        <SectionTitle title="Transactions" />
        <nav>
          <MenuItem icon={FaWallet} text="Wallet" to="/wallet" />
          <MenuItem icon={FaListAlt} text="Transactions" to="/transactions" />
          <MenuItem icon={FaKey} text="API Key" to="/api-key" />
        </nav>
      </div>

      {/* User Guide Section */}
      <div className="mt-4">
        <SectionTitle title="User Guide" />
        <nav>
          <MenuItem icon={FaCog} text="Profile Settings" to="/settings" />
          <MenuItem icon={FaQuestionCircle} text="Help Center" to="/help" />
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
  );
};

export default Sidebar; 