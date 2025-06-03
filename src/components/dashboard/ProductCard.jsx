import React from 'react';
import { FaFacebook, FaShoppingCart } from 'react-icons/fa';
import { Button } from '../common/Button';

const ProductCard = ({
  title,
  stock,
  price,
  onBuy,
  onStockClick,
}) => (
  <div className=" bg- rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.10)] border-b-2 border-[#FEBB4F] flex flex-col justify-between min-h-[120px]">
    {/* Mobile Layout */}
    <div className="flex sm:hidden">
      {/* Icon */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white mr-3">
        <FaFacebook className="text-[#1877F2] text-2xl" />
      </div>
      {/* Info and Actions */}
      <div className="flex-1 flex flex-col ">
        <div className="font-bold text-sm text-text-primary">{title}</div>
        <button
          className="text-[13px] text-primary font-medium mt-1 text-left"
          onClick={onStockClick}
        >
          {stock} Accounts in Stock
        </button>
        <div className="flex justify-between items-center mt-2">
          <div className="font-bold text-lg text-primary mr-4">₦ {price}</div>
          <Button
  variant="orange"
  size="sm"
  icon={<FaShoppingCart />}
  onClick={onBuy}
>
  Buy Now
</Button>
        </div>
      </div>
    </div>

    {/* Desktop Layout (unchanged) */}
    <div className="hidden sm:flex flex-col justify-between min-h-[220px]">
      <div className="flex md:flex-col gap-3">
        <div className="flex md:flex-col gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-start mt-1">
            <img src="/icons/facebook.svg" alt="Facebook" className="w-8 h-8 mb-2" />
          </div>
          <div className="flex md:flex-col gap-3">
            <div className='items-center'>
              <h3 className="font-bold text-[15px] text-text-primary mb-4 leading-tight">{title}</h3>
            </div>
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <p className="hidden md:block text-xs text-text-grey font-bold mb-2">Facebook</p>
            <div className='w-1 h-1 hidden md:block rounded-full bg-text-grey'></div>
            <button
              className="text-xs text-primary font-medium mb-2"
              onClick={onStockClick}
            >
              {stock} Accounts in Stock
            </button>
          </div>
        </div>
      </div>
      <div className=" items-end justify-between mt-4">
        
          <div className="font-bold text-lg text-text-primary mb-4">₦{price}</div>
       <Button
  variant="quinary"
  size="sm"
  onClick={onBuy}
>
  <img className='w-4 h-4 mr-2' src="/icons/cart.svg" alt="" />
  Buy Now
</Button>
      </div>
    </div>
  </div>
);

export default ProductCard; 