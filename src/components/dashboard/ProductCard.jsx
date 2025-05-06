import React from 'react';
import { FaFacebook } from 'react-icons/fa';

const ProductCard = ({ title, description, price, additionalInfo }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FaFacebook className="text-[#1877F2] text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-3">{description}</p>
          <div className="mb-4">
            <p className="font-bold text-gray-900">₦{price}</p>
            <p className="text-xs text-gray-500 mt-1">{additionalInfo}</p>
          </div>
          <button className="w-full bg-[#FF6B00] text-white py-2.5 rounded-lg hover:bg-[#FF5500] transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 