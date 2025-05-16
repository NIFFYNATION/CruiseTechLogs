import React from 'react';
import { FaFacebook, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({
  title,
  stock,
  price,
  onBuy,
  onStockClick,
}) => (
  <div className="bg-background rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.10)] border-b-2 border-[#FEBB4F] flex flex-col justify-between min-h-[120px]">
    {/* Mobile Layout */}
    <div className="flex sm:hidden">
      {/* Icon */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white mr-3">
        <FaFacebook className="text-[#1877F2] text-2xl" />
      </div>
      {/* Info and Actions */}
      <div className="flex-1 flex flex-col ">
        <div className="font-semibold text-sm text-text-primary">{title}</div>
        <button
          className="text-[13px] text-primary font-medium mt-1 text-left"
          onClick={onStockClick}
        >
          {stock} Accounts in Stock
        </button>
        <div className="flex justify-between items-center mt-2">
          <div className="font-bold text-lg text-primary mr-4">₦ {price}</div>
          <button
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#ff8c1a] text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors"
            onClick={onBuy}
          >
            <FaShoppingCart />
            Buy Now
          </button>
        </div>
      </div>
    </div>

    {/* Desktop Layout (unchanged) */}
    <div className="hidden sm:flex flex-col justify-between min-h-[220px]">
      <div className="flex md:flex-col gap-3">
        <div className="flex md:flex-col gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-start mt-1">
            <FaFacebook className="text-[#1877F2] text-xl" />
          </div>
          <div className="flex md:flex-col gap-3">
            <div className='items-center'>
              <h3 className="font-semibold text-[15px] text-text-primary mb-4 leading-tight">{title}</h3>
            </div>
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <p className="hidden md:block text-xs text-gray-500 mb-2">Facebook</p>
            <div className='w-1 h-1 hidden md:block rounded-full bg-gray-500'></div>
            <button
              className="text-xs text-primary font-medium mb-2"
              onClick={onStockClick}
            >
              {stock} Accounts in Stock
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <div className="font-bold text-lg text-text-primary">₦{price}</div>
        </div>
        <button
          className="flex items-center gap-2 bg-quinary hover:bg-quaternary text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors"
          onClick={onBuy}
        >
          <FaShoppingCart />
          Buy Now
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard; 