import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHistory, FaCog } from 'react-icons/fa';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background-alt flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-secondary hidden lg:block">
        <div className="p-4">
          <img src="/light_logo.png" alt="CruiseTech" className="h-8" />
        </div>
        
        <nav className="mt-8">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-background-alt
              ${isActive ? 'bg-primary/10 text-primary' : ''}`
            }
          >
            <FaHome /> Home
          </NavLink>
          <NavLink 
            to="/dashboard/orders"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-background-alt
              ${isActive ? 'bg-primary/10 text-primary' : ''}`
            }
          >
            <FaShoppingCart /> Orders
          </NavLink>
          <NavLink 
            to="/dashboard/transactions"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-background-alt
              ${isActive ? 'bg-primary/10 text-primary' : ''}`
            }
          >
            <FaHistory /> Transactions
          </NavLink>
          <NavLink 
            to="/dashboard/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-background-alt
              ${isActive ? 'bg-primary/10 text-primary' : ''}`
            }
          >
            <FaCog /> Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-background border-b border-secondary h-16 flex items-center px-6">
          {/* Add header content (search, notifications, profile) */}
        </header>
        
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 