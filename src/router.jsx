import { createBrowserRouter, useParams } from 'react-router-dom';
import LandingPage from './Pages/landingPage';
import Login from './Pages/login/login';
import Signup from './Pages/signup/signup';
import Registration from './Pages/registration';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './Pages/Dashboard';
import ManageNumbers from './components/dashboard/manageNumbers/ManageNumbers';
import BuyNumbers from './components/dashboard/buyNumbers/BuyNumbers';
import BuyEmails from './components/dashboard/buyEmails/BuyEmails';
// import ManageEmails from './components/dashboard/manageEmails/ManageEmails';
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
import DepositPage from './components/dashboard/deposit/DepositPage';
import PaymentValidation from './components/dashboard/deposit/PaymentValidation';
import ForgotPassword from './Pages/passwordRecovery/ForgotPassword';
import ResetPassword from './Pages/login/ResetPassword';
import ProtectedRoute from './routes/ProtectedRoute';
import StagesPage from './components/dashboard/stages/StagesPage';
import ReferralPage from './components/dashboard/ReferralPage';
import NotFoundPage from './Pages/NotFoundPage';
// import ShopLayout from './shop/layout/ShopLayout';
// import ShopDashboard from './shop/pages/ShopDashboard';
// import ShopProducts from './shop/pages/ShopProducts';
// import ShopLandingPage from './shop/pages/ShopLandingPage';
// import { Navigate } from 'react-router-dom';

// Wrapper to pass orderId param to ManageNumbers
const ManageNumbersWithOrderId = (props) => {
  const params = useParams();
  // orderId can be undefined if not present
  return <ManageNumbers orderId={params.orderId} {...props} />;
};


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
        path: '/signup/:ref',
        element: <Signup />
      },
      {
        path: '/registration',
        element: <Registration />
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <Dashboard /> },
          // Route with optional orderId param
          { path: 'manage-numbers', element: <ManageNumbersWithOrderId /> },
          { path: 'manage-rentails', element: <ManageNumbersWithOrderId /> },
          { path: 'manage-numbers/:orderId', element: <ManageNumbersWithOrderId /> },
          { path: 'manage-rentals/:orderId', element: <ManageNumbersWithOrderId /> },
          { path: 'buy-numbers', element: <BuyNumbers /> },
          { path: 'buy-emails', element: <BuyEmails /> },
          // { path: 'manage-emails', element: <ManageEmails /> },
          { path: 'accounts', element: <SocialMediaAccounts /> },
          { path: 'accounts/buy/:id', element: <BuyAccountPage /> }, // <-- add :id param
          { path: 'accounts/buy', element: <BuyAccountPage /> }, // fallback for old links
          { path: 'accounts/order/:id', element: <OrderConfirmedPage /> },
          { path: 'wallet', element: <Wallet /> },
          { path: 'deposit', element: <DepositPage /> },
          { path: 'deposit/validate', element: <PaymentValidation /> },
          { path: 'manage-orders', element: <ManageOrders /> },
          { path: 'transactions', element: <Transactions /> },
          { path: 'api-page', element: <ApiPage /> },
          { path: 'profile-settings', element: <ProfileSettings /> },
          { path: 'help-center', element: <HelpCenter /> },
          { path: 'stages', element: <StagesPage /> },
          { path: 'referral', element: <ReferralPage /> },
          { path: 'referrals', element: <ReferralPage /> },
        ],
      },
      // {
      //   path: '/shop',
      //   children: [
      //     {
      //       index: true,
      //       element: <ShopLandingPage />
      //     },
      //     {
      //       element: (
      //         <ProtectedRoute>
      //           <ShopLayout />
      //         </ProtectedRoute>
      //       ),
      //       children: [
      //         { path: 'dashboard', element: <ShopDashboard /> },
      //         { path: 'products', element: <ShopProducts /> },
      //       ]
      //     }
      //   ]
      // },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
