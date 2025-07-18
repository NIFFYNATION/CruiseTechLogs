import React from "react";
import { Button } from "../../common/Button";

const CartQuantityControl = ({
  quantity = 1,
  onIncrement,
  onDecrement,
  onClearCart,
  onChange, // allow direct onChange
  available = 0,
  showAvailable = true,
  className = "gap-10   lg:gap-32",
}) => (
  <div className={`lg:flex lg:items-center gap-4 ${className}`}>
    <div className="flex items-center w-40 h-11 border border-primary rounded-lg overflow-hidden ">
      <button
        className="flex-1 h-full flex items-center justify-center text-xl text-primary hover:bg-primary/10 transition"
        onClick={() => {
          if (quantity > 0 && onDecrement) onDecrement();
        }}
        aria-label="Decrease"
        type="button"
        style={{ borderRight: '1.5px solid #0B4B5A' }}
        disabled={quantity === 0}
      >
        –
      </button>
      <input
        type="number"
        min={0}
        max={available}
        value={quantity}
        onChange={e => {
          let val = Number(e.target.value);
          // If the current value is 0 and user types a digit, overwrite the 0
          if (quantity === 0 && e.target.value.length === 1 && e.target.value !== "0") {
            val = Number(e.target.value);
          }
          if (onChange) {
            onChange(val);
          } else {
            if (val === 0 || e.target.value === "") {
              onClearCart && onClearCart();
            } else if (val > quantity && onIncrement) {
              onIncrement();
            } else if (val < quantity && onDecrement) {
              onDecrement();
            }
          }
        }}
        className="flex-1 h-full text-center text-2xl text-primary font-semibold bg-transparent outline-none border-none"
        style={{ width: 50, borderRight: '1.5px solid #0B4B5A' }}
      />
      <button
        className="flex-1 h-full flex items-center justify-center text-2xl text-primary hover:bg-primary/10 transition"
        onClick={() => {
          if (quantity < available && onIncrement) onIncrement();
        }}
        aria-label="Increase"
        type="button"
        disabled={quantity >= available}
      >
        +
      </button>
    </div>
    {showAvailable && (
      <span className="text-quinary font-semibold text-xs md:text-base">
        {available}  pcs available
      </span>
    )}
    
  </div>
);

export default CartQuantityControl;
