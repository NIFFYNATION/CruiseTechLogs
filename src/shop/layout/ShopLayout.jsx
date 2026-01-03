import React, { useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';
import ShopSidebar from '../components/ShopSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../../controllers/userController';

const ShopLayoutContent = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f5f2]">
      <ShopSidebar />
      <main className="flex-1 w-full min-w-0 transition-all duration-300">
        <DashboardHeader />
        <div className="p-6 sm:p-10 lg:p-12 max-w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const ShopLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If shop requires login, we check here.
    // Assuming shop is protected like dashboard.
    if (!isUserLoggedIn()) {
      navigate('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <SidebarProvider>
      <ShopLayoutContent />
    </SidebarProvider>
  );
};

export default ShopLayout;
