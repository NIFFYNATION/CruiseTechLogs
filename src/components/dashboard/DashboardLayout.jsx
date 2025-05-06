import React from 'react';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary">
        <Sidebar />
        <main className="flex-1 transition-all duration-300 ml-8 pl-[80px] lg:pl-[260px] p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout; 