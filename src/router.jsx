import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './Pages/landingPage';
import Login from './Pages/login';
import Registration from './Pages/registration';
import Dashboard from './Pages/Dashboard';
import App from './App';
import ManageNumbers from './components/dashboard/manageNumbers/ManageNumbers';

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
        path: '/registration',
        element: <Registration />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/manage-numbers',
        element: <ManageNumbers />
      },
    ],
  },
]);
