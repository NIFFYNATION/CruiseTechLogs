import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [onSuccess, setOnSuccess] = useState(null);

  const openLogin = useCallback((callback) => {
    setView('login');
    setOnSuccess(() => callback);
    setIsOpen(true);
  }, []);

  const openRegister = useCallback((callback) => {
    setView('register');
    setOnSuccess(() => callback);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Don't clear onSuccess immediately to avoid race conditions if needed, 
    // but usually it's fine. We'll clear it when opening next time.
    // Actually, clearing it is safer.
    setOnSuccess(null); 
  }, []);

  const handleSuccess = useCallback((data) => {
    if (onSuccess) {
      onSuccess(data);
    }
    closeModal();
  }, [onSuccess, closeModal]);

  return (
    <AuthModalContext.Provider value={{ isOpen, view, setView, openLogin, openRegister, closeModal, handleSuccess }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
