import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthModalProvider } from '../context/AuthModalContext';
import AuthModal from '../components/AuthModal';

const ShopRootLayout = () => {
  return (
    <AuthModalProvider>
      <div className="theme-shop w-full min-h-screen bg-white font-display">
        <Outlet />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
};

export default ShopRootLayout;
