import React, { useEffect, useState } from "react";
import { extractLastNumber } from "../../../utils/formatUtils";
import Toast from "../../common/Toast";
import { getStages } from "../../../services/generalService";

function moneyFormat(amount) {
  if (isNaN(amount)) return "₦0.00";
  return (
    "₦" + Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

const StagesPage = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getStages()
      .then(setStages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen to-white px-2 sm:px-0 pb-10 mt-5">
      {error && <Toast type="error" message={error} onClose={() => setError("")} />}
      {/* Header (not sticky) */}
      <div className="top-0 z-10 bg-white/90 backdrop-blur border-b border-orange-100 px-4 py-4 md:py-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-2">How Our Discount Plan Works</h1>
        <p className="text-gray-700 text-sm sm:text-base mb-2">
          Our discount plan rewards loyal users who fund their accounts. The more you deposit, the higher your level and the better your discount on future orders.
        </p>
        <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 mb-2 space-y-1">
          <li><b>Total Deposit:</b> Amount needed to unlock a level.</li>
          <li><b>Discount:</b> Percentage off your orders at that level.</li>
          <li><b>Minimum Order:</b> Minimum accounts to order in one transaction to enjoy the discount.</li>
        </ul>
        <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-xs sm:text-sm font-medium mb-1">
          <b>Note:</b> Discount plans do not apply to numbers. This plan can be reviewed and adjusted without notice.
        </div>
      </div>

      {/* Stages grid - adaptive layout */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 px-1 sm:px-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl shadow p-6 flex flex-col gap-4 min-h-[180px] md:min-h-[220px]" />
          ))
        ) : stages.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-lg">No stages found.</div>
        ) : (
          stages.map((stage, idx) => {
            const levelNum = extractLastNumber(stage.name);
            const badgeUrl = `/icons/level-badge-${parseInt(levelNum, 10) + 1}.svg`;
            return (
              <div
                key={stage.name}
                className="bg-white/30 rounded-2xl shadow-lg p-5 md:p-8 flex flex-col items-center gap-3 border border-orange-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 min-h-[200px] md:min-h-[260px] group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={badgeUrl} alt={stage.name} className="w-10 h-10 md:w-14 md:h-14 group-hover:scale-110 transition-transform" />
                  <span className="text-lg md:text-2xl font-bold text-primary">{stage.name}</span>
                </div>
                <div className="flex flex-col gap-3 w-full mt-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">Total Deposit</span>
                    <span className="font-semibold text-primary text-base md:text-lg">{moneyFormat(stage.totalCredit)}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">Discount</span>
                    <span className="font-semibold text-green-600 text-base md:text-lg">{stage.discount}%</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">Min. Order</span>
                    <span className="font-semibold text-orange-500 text-base md:text-lg">{stage.no_order}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StagesPage; 