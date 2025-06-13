import React from "react";
import { Button } from "../../common/Button";

const CartQuantityControl = ({
  quantity,
  onIncrement,
  onDecrement,
  onClearCart,
  available = 0,
  showAvailable = true,
  className = "gap-10   lg:gap-32",
}) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="flex items-center w-40 h-11 border border-primary rounded-lg overflow-hidden ">
      <button
        className="flex-1 h-full flex items-center justify-center text-xl text-primary hover:bg-primary/10 transition"
        onClick={onDecrement}
        aria-label="Decrease"
        type="button"
        style={{ borderRight: '1.5px solid #0B4B5A' }}
        disabled={quantity === 0}
      >
        –
      </button>
      <div
        className="flex-1 h-full flex items-center justify-center text-2xl text-primary font-semibold"
        style={{ borderRight: '1.5px solid #0B4B5A' }}
      >
        {quantity}
      </div>
      <button
        className="flex-1 h-full flex items-center justify-center text-2xl text-primary hover:bg-primary/10 transition"
        onClick={onIncrement}
        aria-label="Increase"
        type="button"
      >
        +
      </button>
    </div>
    {showAvailable && (
      <span className="text-quinary font-semibold text-xs md:text-base hidden sm:block">
        {available} Accounts Available
      </span>
    )}
    {quantity > 0 && (
      <Button
        variant="orange"
        size="sm"
        className="ml-auto flex items-center gap-2"
        onClick={onClearCart}
      >
        <img src="/icons/trash.svg" alt="Clear Cart" className="w-4 h-4" />
        Clear Cart
      </Button>
    )}
  </div>
);

export default CartQuantityControl;
