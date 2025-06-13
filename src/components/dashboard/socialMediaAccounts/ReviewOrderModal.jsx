import React from "react";
import { Button } from "../../common/Button";
import CartItem from "./CartItem";
import CartQuantityControl from "./CartQuantityControl";

const ReviewOrderModal = ({
  open,
  cart,
  onClose,
  onBuy,
  onRemove,
  onClearCart,
  onIncrement,
  onDecrement,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 border-b border-border-grey">
          <h2 className="text-lg font-semibold">Review Order</h2>
        </div>

        {/* Quantity Selector and Clear Cart */}
        <div className="flex  items-center   gap-4 px-6 py-4">
          <CartQuantityControl
            quantity={cart.length}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onClearCart={onClearCart}
            showAvailable={false}
          />
          
        </div>

        {/* Cart Items */}
        <div className="flex flex-col gap-4 px-6 pb-6">
          {cart.length === 0 ? (
            <h3 className="text-sm mt-1 text-primary text-center">No Accounts Added</h3>
          ) : (
            cart.map((item, idx) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => onRemove(idx)}
                onView={() => {/* handle view logic if needed */}}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 items-center border-t border-border-grey px-6 py-4 bg-bgLayout">
          <Button
            variant="outline"
            size="md"
            className="w-32"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="orange"
            size="md"
            className="w-32"
            onClick={onBuy}
            disabled={cart.length === 0}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderModal;
