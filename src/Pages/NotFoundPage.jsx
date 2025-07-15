import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-4">
      <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-3xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
        <div className="text-7xl mb-4 text-primary/50"><h2><b>404</b></h2></div>
        <h1 className="text-3xl font-bold text-primary mb-2">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Oops! The page you are looking for does not exist or has been moved.<br />
          Try going back to the dashboard or home page.
        </p>
        <button
          className="bg-quinary hover:bg-quaternary text-white font-bold rounded-full px-8 py-3 text-lg shadow-lg transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
        <button
          className="mt-3 text-primary underline text-sm hover:text-quinary"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 