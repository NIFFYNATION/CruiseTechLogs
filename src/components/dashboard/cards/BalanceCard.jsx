import React from "react";
import { useUser } from "../../../contexts/UserContext";
import { money_format } from "../../../utils/formatUtils"; // <-- use utility
import { useNavigate } from "react-router-dom";
import { SkeletonBalanceCard } from "../../common/Skeletons";

const BalanceCard = ({ isSimple = false }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  if (loading || !user) {
    return (
      <SkeletonBalanceCard isSimple={isSimple} />
    );
  }

  return (
    <div
      className={`user-balance rounded-[20px] relative overflow-hidden  ${isSimple ? "p-4 min-h-[120px]" : "max-h-300"}`}
      style={{
        background: `#FF6B00 url('/balance-card-bg.png') no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <div className={`flex flex-col justify-between items-start md:items-center h-full ${isSimple ? "p-4" : "p-8"}`}>
        <div className="text-center">
          <p className={`text-white/90 text-md mb-0  mt-0 md:mt-4 ${isSimple ? "md:mb-2" : "md:mb-6"}`}>Your Total Balance</p>
          <h2 className={`text-white font-bold text-[42px] `}>
            {money_format(user.balance)}
          </h2>
        </div>
        {!isSimple && (
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-full text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors"
              onClick={() => navigate("/dashboard/wallet")}
            >
              <img src="/icons/add-circle.svg" alt="" className="h-6 w-6" />
              Add Funds
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-full text-[#1A1A1A] text-sm font-medium hover:bg-white/90 transition-colors"
              onClick={() => navigate("/dashboard/transactions")}
            >
              <img src="/icons/list-broken.svg" alt="" className="h-6 w-6" />
              Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
