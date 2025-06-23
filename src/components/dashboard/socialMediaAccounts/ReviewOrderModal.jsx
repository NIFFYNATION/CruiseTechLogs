import React from "react";
import { Button } from "../../common/Button";
import CartItem from "./CartItem";
import CartQuantityControl from "./CartQuantityControl";
import { money_format } from "../../../utils/formatUtils";

const ReviewOrderModal = ({
  open,
  cart,
  onClose,
  onBuy,
  onRemove,
  onClearCart,
  onIncrement,
  onDecrement,
  quantity,
  product,
  isProcessing,
}) => {
  if (!open) return null;

  // If cart has items, use first cart item for info; else use product
  const hasCart = cart.length > 0;
  const info = hasCart ? (cart[0].item || cart[0]) : (product || {});
  const accountTitle = info.title || '';
  const accountPlatform = info.platform?.label || info.platform?.name || '';
  const accountPrice = info.amount || info.price || '';
  const unitAmount = Number(String(info.amount || info.price || 0).replace(/,/g, ""));
  const effectiveQuantity = hasCart ? cart.length : (quantity || 0);
  const totalAmount = hasCart
    ? cart.reduce((sum, item) => sum + Number(String(item.amount || item.price).replace(/,/g, "")), 0)
    : effectiveQuantity * unitAmount;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-xl mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 border-b border-border-grey">
          <h2 className="text-lg font-semibold">Review Order</h2>
        </div>

        {/* Order Summary */}
        <div className="px-6 pt-4 pb-2 border-b border-border-grey">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-base text-primary">{accountTitle}</div>
              <div className="text-xs text-text-secondary">
                Platform: <span className="text-primary font-semibold">{accountPlatform}</span>
              </div>
              <div className="text-xs text-text-secondary">
                Price per Account: <span className="text-primary font-semibold">{money_format(accountPrice)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-primary text-lg">
                Total: {money_format(totalAmount)}
              </span>
              <span className="text-xs text-text-secondary">
                Quantity: <span className="text-primary font-semibold">{effectiveQuantity}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 px-6 py-4">
          <CartQuantityControl
            quantity={effectiveQuantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onClearCart={onClearCart}
            showAvailable={false}
          />
        </div>

        {/* Cart Items */}
        <div className="flex flex-col gap-4 px-6 pb-6">
          {hasCart ? (
            cart.map((item, idx) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => onRemove(idx)}
                onView={() => {/* handle view logic if needed */}}
              />
            ))
          ) : effectiveQuantity > 0 ? (
            <h3 className="text-sm mt-1 text-primary text-center">{effectiveQuantity} Account(s) will be purchased</h3>
          ) : (
            <h3 className="text-sm mt-1 text-primary text-center">No Accounts Added</h3>
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
            disabled={effectiveQuantity === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderModal;
