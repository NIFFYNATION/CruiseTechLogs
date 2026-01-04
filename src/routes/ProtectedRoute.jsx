import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isUserLoggedIn } from '../controllers/userController'; // Import userController

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/registration', '/'].includes(location.pathname) || location.pathname.startsWith('/signup/');

  if (!isUserLoggedIn() && !isAuthPage) {
    return <Navigate to="/login" replace state={{ from: location }} />; // Redirect to login if user is not logged in
  }

  return (location.pathname !== '/') ? children : <></>; // Render the protected component if user is logged in
};

export default ProtectedRoute;
