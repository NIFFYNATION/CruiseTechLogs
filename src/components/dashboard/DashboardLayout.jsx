import React, { useEffect, useState } from 'react';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { isUserLoggedIn } from '../../controllers/userController'; // Import userController to check login status
import { fetchLiveChatWidget } from '../../services/generalService';
import parse from 'html-react-parser';
import he from 'he';

const DashboardLayout = () => {
    const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization
    const navigate = useNavigate();
    const [liveChatWidget, setLiveChatWidget] = useState(null);
  
    useEffect(() => {
      if (!isUserLoggedIn()) {
        navigate('/login'); // Redirect to login if user is not logged in
      } else {
        setIsAuthorized(true); // Set authorization state to true
      }
    }, [navigate]);
  
    useEffect(() => {
      fetchLiveChatWidget().then(setLiveChatWidget);
    }, []);
  
    if (!isAuthorized) {
      return null; // Prevent rendering if user is not authorized
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
      {/* Style for chatway widget trigger */}
      <style>{`.chatway--trigger-container { margin-bottom: 70px !important; }`}</style>
      {/* Live Chat Widget */}
      {liveChatWidget && (
        <>{parse(he.decode(liveChatWidget))}</>
      )}
    </SidebarProvider>
  );
};

export default DashboardLayout; 