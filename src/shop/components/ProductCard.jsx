import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice, cleanDescription } from '../shop.config';

const ProductCard = ({
  id,
  image,
  title,
  description,
  price,
  oldPrice,
  badge,
  variants,
  onAddToCart
}) => {
  return (
    <motion.div variants={variants} className="group relative bg-white rounded-lg sm:rounded-3xl p-1 sm:p-3 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative h-40 sm:h-56 md:h-64 rounded-lg sm:rounded-2xl overflow-hidden mb-3 bg-gray-50">
        <Link to={`/shop/products/${id}`} className="block w-full h-full">
          <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${image}')` }}></div>
        </Link>
        {badge === "New" ? (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#0f1115] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded uppercase tracking-wider shadow-sm">
            {badge}
          </div>
        ) : badge === "Featured" ? (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#ff6a00] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px] sm:text-[12px]">star</span>
            {badge}
          </div>
        ) : badge ? (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-md text-[#0f1115] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded uppercase tracking-wider shadow-sm border border-gray-100">
            {badge}
          </div>
        ) : null}

        <button className="absolute top-2 right-2 sm:top-3 sm:right-3 size-7 sm:size-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white flex items-center justify-center transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">favorite</span>
        </button>
      </div>
      <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-1 flex flex-col">
        <div className="mb-2">
          <Link to={`/shop/products/${id}`}>
            <h3 className="font-bold text-sm sm:text-base text-[#0f1115] group-hover:text-[#ff6a00] transition-colors cursor-pointer line-clamp-2 sm:line-clamp-1">{cleanDescription(title)}</h3>
          </Link>
          <p className="text-[10px] sm:text-xs text-[#6b7280] mt-0.5 sm:mt-1 line-clamp-1">{cleanDescription(description)}</p>
          <div className="flex items-center gap-1 mt-2 text-green-600">
            <span className="material-symbols-outlined text-[12px] sm:text-[14px]">local_shipping</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Free Shipping</span>
          </div>
        </div>
        <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-50 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <span className="text-sm sm:text-lg font-bold text-[#0f1115]">{typeof price === 'number' ? formatPrice(price) : price}</span>
            {oldPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">{typeof oldPrice === 'number' ? formatPrice(oldPrice) : oldPrice}</span>
            )}
          </div>
          {onAddToCart ? (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation if wrapped in Link
                onAddToCart();
              }}
              className="h-7 sm:h-10 w-auto px-2.5 sm:px-4 rounded-full bg-[#0f1115] text-white text-[9px] sm:text-xs font-bold hover:bg-[#ff6a00] hover:shadow-lg hover:shadow-[#ff6a00]/20 transition-all duration-200 flex items-center justify-center gap-1"
            >
              <span>Add</span>
              <span className="material-symbols-outlined text-[12px] sm:text-[16px]">add_shopping_cart</span>
            </button>
          ) : (
            <Link
              to={`/shop/products/${id}?buy=true`}
              className="h-7 sm:h-10 w-auto px-2.5 sm:px-4 rounded-full bg-[#0f1115] text-white text-[9px] sm:text-xs font-bold hover:bg-[#ff6a00] hover:shadow-lg hover:shadow-[#ff6a00]/20 transition-all duration-200 flex items-center justify-center gap-1"
            >
              <span>Add</span>
              <span className="material-symbols-outlined text-[12px] sm:text-[16px]">add_shopping_cart</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
