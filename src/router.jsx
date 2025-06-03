import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './Pages/landingPage';
import Login from './Pages/login/login';
import Signup from './Pages/signup/signup';
import Registration from './Pages/registration';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './Pages/Dashboard';
import ManageNumbers from './components/dashboard/manageNumbers/ManageNumbers';
import BuyNumbers from './components/dashboard/buyNumbers/BuyNumbers';
import App from './App';
import SocialMediaAccounts from './components/dashboard/socialMediaAccounts/SocialMediaAccounts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      // Add more routes here as needed
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/registration',
        element: <Registration />
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { path: '', element: <Dashboard /> },
          { path: 'manage-numbers', element: <ManageNumbers /> },
          { path: 'buy-numbers', element: <BuyNumbers /> },
          { path: 'social-media-accounts', element: <SocialMediaAccounts /> },
        ],
      },
    ],
  },
]);
