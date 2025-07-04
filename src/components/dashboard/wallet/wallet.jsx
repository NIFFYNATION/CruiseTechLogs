import React, { useState, useEffect } from "react";
import WalletCard from "../../WalletCard";
import { Button } from "../../common/Button";
import FundWalletModal from "./FundWalletModal";
import CryptoWalletCard from "./CryptoWalletCard";
import VirtualAccountCard from "./VirtualAccountCard";
import { fetchUserCryptoWallet, fetchUserAccounts } from "../../../services/userService";
import Transactions from "./Transactions";
import BalanceCard from "../cards/BalanceCard";
import { SkeletonCard } from "../../common/Skeletons";
import { fetchUserDetails } from '../../../controllers/userController';

const Wallet = () => {
  const [balance] = useState("0.00");
  const [fundModalOpen, setFundModalOpen] = useState(false);

  // Crypto wallet state
  const [cryptoWallet, setCryptoWallet] = useState(null);
  // Virtual accounts state
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always fetch latest user details when wallet is rendered
    fetchUserDetails();
  }, []);

  // Fetch crypto wallet and virtual accounts on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUserCryptoWallet().then(setCryptoWallet),
      fetchUserAccounts().then(setAccounts),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-2 sm:p-6 mt-3">
      {/* <h2 className="text-xl font-semibold mb-6 text-primary">My Wallet</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card + Virtual Account */}
        <div className="flex flex-col gap-4 border border-bgLayout shadow border-b-[#FEBB4F]  bg-white rounded-xl p-2">
          {/* Balance Card */}
          <div className="overflow-hidden">
            <div className=" relative">
              {loading ? <SkeletonCard className="min-h-[120px]" /> : <BalanceCard isSimple={true}/>} 
            </div>
            {/* Virtual Account Details */}
            {!loading && <VirtualAccountCard accounts={accounts} />}
          </div>
        </div>
        {/* Crypto Card */}
        {loading ? <SkeletonCard className="min-h-[120px]" /> : (
          <CryptoWalletCard
            currency={cryptoWallet?.currency}
            network={cryptoWallet?.network}
            address={cryptoWallet?.address}
            url={cryptoWallet?.url}
          />
        )}
      </div>
      {/* Recent Transactions */}
     
        
        <Transactions isRecent={true} 
        title="Recent Transactions"
        fundButton={<Button
            variant="orange"
            size="sm"
            className="px-4"
            onClick={() => window.location.href = "/dashboard/transactions"}
          >
            View All Transactions
          </Button>} 
        loading={loading}
      />
    
      <FundWalletModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        onConfirm={amount => {
          setFundModalOpen(false);
          alert(`You want to fund ₦${amount}`);
          // Handle your top-up logic here
        }}
      />
    </div>
  );
};

export default Wallet;
