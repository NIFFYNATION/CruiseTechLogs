import React, { useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { money_format } from "../../../utils/formatUtils"; // <-- use utility
import { useNavigate } from "react-router-dom";
import { SkeletonBalanceCard } from "../../common/Skeletons";
import { triggerRentalCronjob } from "../../../services/rentalService";

const BalanceCard = ({ isSimple = false }) => {
  const { user, loading } = useUser();
  const [refreshing, setRefreshing] = useState(false);
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
          {/* Title and refresh action inline */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-white/80 text-sm m-0">Your Total Balance</p>
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1 bg-white/90 rounded-full text-xs font-medium hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={async () => {
                if (refreshing) return;
                const uid = user?.userID || user?.ID;
                if (!uid) return;
                setRefreshing(true);
                const ok = await triggerRentalCronjob(uid);
                if (ok) {
                  window.location.reload();
                } else {
                  setRefreshing(false);
                }
              }}
              disabled={refreshing}
              title="Refresh balance"
            >
              <img src="/icons/reload.svg" alt="Refresh" className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
          <h2 className="text-white font-bold text-3xl md:text-4xl mt-1">
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
