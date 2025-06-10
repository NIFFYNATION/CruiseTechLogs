import React from 'react';
import { Navigate } from 'react-router-dom';
import { isUserLoggedIn } from '../controllers/userController'; // Import userController

const ProtectedRoute = ({ children }) => {
  if (!isUserLoggedIn()) {
    return <Navigate to="/login" replace />; // Redirect to login if user is not logged in
  }

  return children; // Render the protected component if user is logged in
};

export default ProtectedRoute;
