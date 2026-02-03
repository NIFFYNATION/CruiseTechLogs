import React, { useEffect, useState } from 'react';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../../controllers/userController';
import LiveChatWidget from '../common/LiveChatWidget';

const DashboardLayout = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
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
        <div className="flex justify-center min-h-screen">
          <Sidebar />
          <main className="flex-1 mt-16 transition-all duration-300 ml-0 lg:ml-8 pl-[8px] sm:pl-[30px] md:pl-[60px] xl:pl-[260px] p-2 sm:p-10">
            <DashboardHeader />
            <Outlet />
          </main>
        </div>
        <LiveChatWidget />
      </SidebarProvider>
    );
};

export default DashboardLayout;
/*
Add this to your global CSS for animation:
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.3s ease; }
*/ 