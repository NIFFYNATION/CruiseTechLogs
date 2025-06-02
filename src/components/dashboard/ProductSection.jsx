import React from "react";
import ProductCard from "./ProductCard";

const ProductSection = ({
  title,
  products,
  onBuy,
  onStockClick,
  viewAllLabel,
  onViewAll,
  showViewAll = false,
  mobileViewMoreLabel,
}) => (
  <div className="mb-6 sm:mb-8">
    <div className="flex justify-between items-center mb-2 sm:mb-4">
      <div className="font-semibold text-base sm:text-lg text-text-primary">{title}</div>
      {showViewAll && (
        <button
          className="text-background font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border bg-quinary hover:bg-quaternary transition"
          onClick={onViewAll}
        >
          {viewAllLabel || "View All"}
        </button>
      )}
    </div>
    <div className="mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product, i) => (
        <ProductCard
          key={i}
          title={product.title}
          stock={product.stock}
          price={product.price}
          onBuy={onBuy}
          onStockClick={onStockClick}
        />
      ))}
    </div>
    {mobileViewMoreLabel && (
      <div className='flex md:hidden justify-center items-center mt-6 mb-6'>
        <p className='text-text-grey text-sm font-medium'>{mobileViewMoreLabel}</p>
      </div>
    )}
  </div>
);

export default ProductSection;
