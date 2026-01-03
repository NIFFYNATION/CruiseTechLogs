import React, { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
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
  const { user } = useUser();
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

            // Logic to highlight previous and current stages
            // Assuming extractLastNumber returns a number-like string for "Level 1" -> "1"
            const currentLevel = user?.stage?.name ? parseInt(extractLastNumber(user.stage.name), 10) : 0;
            const stageLevel = parseInt(levelNum, 10) + 1; // Assuming levelNum is 0-indexed based on badge logic, or we parse consistent numbers
            // Actually let's trust extractLastNumber logic from formatUtils. 
            // If "Level 1" -> 1. User "Level 2" -> 2.
            // If stage name is "Level 1", levelNum might be "1". 
            // Let's refine based on typical usage.
            const parsedStageLevel = parseInt(levelNum, 10) || (idx + 1);
            const parsedUserLevel = user?.stage?.name ? (parseInt(extractLastNumber(user.stage.name), 10) || 1) : 1;

            const isActive = parsedStageLevel <= parsedUserLevel;
            const isCurrent = parsedStageLevel === parsedUserLevel;

            return (
              <div
                key={stage.name}
                className={`rounded-2xl shadow-lg p-5 md:p-8 flex flex-col items-center gap-3 border transition-all duration-200 min-h-[200px] md:min-h-[260px] group relative overflow-hidden ${isActive
                    ? "bg-white border-orange-200 ring-2 ring-orange-100/50"
                    : "bg-gray-50/50 border-gray-100 opacity-70 grayscale-[0.5]"
                  } ${isCurrent ? "ring-4 ring-orange-200 shadow-xl scale-[1.02]" : "hover:shadow-2xl hover:-translate-y-1"}`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 text-green-500 bg-green-50 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <img src={badgeUrl} alt={stage.name} className={`w-10 h-10 md:w-14 md:h-14 transition-transform ${isActive ? 'group-hover:scale-110' : ''}`} />
                  <span className={`text-lg md:text-2xl font-bold ${isActive ? 'text-primary' : 'text-gray-500'}`}>{stage.name}</span>
                </div>
                <div className="flex flex-col gap-3 w-full mt-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">Total Deposit</span>
                    <span className={`font-semibold text-base md:text-lg ${isActive ? 'text-primary' : 'text-gray-600'}`}>{moneyFormat(stage.totalCredit)}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">Discount</span>
                    <span className={`font-semibold text-base md:text-lg ${isActive ? 'text-green-600' : 'text-gray-600'}`}>{stage.discount}%</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">Min. Order</span>
                    <span className={`font-semibold text-base md:text-lg ${isActive ? 'text-orange-500' : 'text-gray-600'}`}>{stage.no_order}</span>
                  </div>
                </div>
                {!isActive && (
                  <div className="mt-auto w-full pt-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-400 font-medium">Earn more points to unlock</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StagesPage; 