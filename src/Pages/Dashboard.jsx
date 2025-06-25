import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add navigation for redirection
import WelcomeSection from '../components/dashboard/WelcomeSection';
import ProductCard from '../components/dashboard/ProductCard';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import ProductSection from '../components/dashboard/ProductSection';
import { isUserLoggedIn, fetchUserDetails } from '../controllers/userController'; // Import userController
import Transactions from '../components/dashboard/wallet/Transactions';

const productData = [
  {
    title: "Random FB|100–300friends (3 months +)",
    stock: 324,
    price: "1,200",
  },
  // ...repeat for as many cards as needed
];

const Dashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization

  useEffect(() => {
    // On dashboard mount, fetch latest user details from API
    fetchUserDetails();
  }, []);

  return (
    <>
      {/* Welcome Section with all cards */}
      <WelcomeSection />
      {/* Transactions Table */}
      <Transactions isRecent={true} title='Recent Transactions'/>
    </>
  );
};

export default Dashboard;