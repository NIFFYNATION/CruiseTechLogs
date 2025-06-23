import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isUserLoggedIn } from '../controllers/userController'; // Import userController

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isUserLoggedIn() && location.pathname !== '/') {
    return <Navigate to="/login" replace />; // Redirect to login if user is not logged in
  }

  return children; // Render the protected component if user is logged in
};

export default ProtectedRoute;
