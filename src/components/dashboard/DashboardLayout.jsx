import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 p-6 pl-[280px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 