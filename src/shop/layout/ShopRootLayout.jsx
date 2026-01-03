import React from 'react';
import { Outlet } from 'react-router-dom';

const ShopRootLayout = () => {
  return (
    <div className="theme-shop w-full min-h-screen bg-white font-display">
      <Outlet />
    </div>
  );
};

export default ShopRootLayout;
