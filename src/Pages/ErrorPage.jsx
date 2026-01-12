import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <span className="material-symbols-outlined text-6xl text-red-500">error</span>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Oops! Something went wrong.</h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.statusText || error.message || "An unexpected error occurred."}
          </p>
        </div>
        <div className="mt-5">
            <Link
                to="/"
                className="font-medium text-[#ff6a00] hover:text-[#e55f00] transition-colors"
            >
                Go back home
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
