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
import BuyAccountPage from './components/dashboard/socialMediaAccounts/BuyAccountPage';
import OrderConfirmedPage from './components/dashboard/socialMediaAccounts/OrderConfirmedPage';
import Wallet from './components/dashboard/wallet/wallet';
import Transactions from './components/dashboard/wallet/Transactions';
import ApiPage from './components/dashboard/apiKey/ApiPage';
import ProfileSettings from './components/dashboard/profileSettings/ProfileSettings';
import HelpCenter from './components/dashboard/helpCenter/HelpCenter';
import ManageOrders from './components/dashboard/manageOrders/ManageOrders';
import ForgotPassword from './Pages/passwordRecovery/ForgotPassword';
import OtpPage from './Pages/passwordRecovery/OtpPage';
import ResetPassword from './Pages/login/ResetPassword';

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
          { path: 'social-media-accounts/buy', element: <BuyAccountPage /> },
          { path: 'social-media-accounts/order-confirmed', element: <OrderConfirmedPage /> },
          { path: 'wallet', element: <Wallet /> },
          { path: 'manage-orders', element: <ManageOrders /> },
          { path: 'transactions', element: <Transactions /> },
          { path: 'api-page', element: <ApiPage /> },
          { path: 'profile-settings', element: <ProfileSettings /> },
          { path: 'help-center', element: <HelpCenter /> },
        ],
      },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/otp', element: <OtpPage /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
]);
