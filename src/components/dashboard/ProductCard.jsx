import React from 'react';
import { FaFacebook, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({
  title,
  stock,
  price,
  onBuy,
  onStockClick,
}) => (
  <div className="bg-background  rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.20)] border-b-2 border-[#FEBB4F] flex flex-col justify-between min-h-[220px]">
    <div className=" items-start gap-3">
      <div className="w-9 h-9  rounded-full flex items-center justify-start mt-1">
        <FaFacebook className="text-[#1877F2] text-xl" />
      </div>
      <div className="">
        <h3 className="font-semibold text-[15px] text-text-primary mb-4 leading-tight">{title}</h3>
        <div className='flex justify-between items-center'>
        <p className="text-xs text-gray-500 mb-2">Facebook</p> 
        <div className='w-1 h-1 rounded-full bg-gray-500'></div>
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
);

export default ProductCard; 