import React from "react";
import { money_format } from "../../../utils/formatUtils";

const CartItem = ({
  item,
  onRemove,
  onView,
  showView = true,
  showRemove = true,
  className = "",
}) => (
  <div
    className={`
      flex items-center justify-between bg-[#FAFAFA] rounded-xl
      px-2 py-2 sm:px-4 sm:py-3 gap-2
      ${className}
    `}
  >
    <div className="flex items-center gap-2 min-w-0">
      <img src={item.platform.icon} alt={item.platform.name} className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
      <span className="font-medium text-text-primary text-xs sm:text-base truncate">{item.username ?? item.platform.name}</span>
    </div>
    <span className="text-text-primary text-xs sm:text-base truncate max-w-[80px] sm:max-w-none">{item.accountId}</span>
    <span className="text-primary font-semibold text-xs sm:text-base whitespace-nowrap">{money_format(item.amount)}</span>
    {showView && (
      <button
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-primary hover:bg-quinary transition hidden sm:flex"
        onClick={onView}
      >
        <img src="/icons/eye-bold.svg" alt="View" className="w-4 h-4 sm:w-5 sm:h-5 invert-0" />
      </button>
    )}
    {showRemove && (
      <button
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-quinary transition"
        onClick={onRemove}
      >
        <span className="text-white text-lg sm:text-xl font-bold">–</span>
      </button>
    )}
  </div>
);

export default CartItem;
