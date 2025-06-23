import React, { useState, useEffect } from 'react';
import { FaFacebook, FaShoppingCart } from 'react-icons/fa';
import { Button } from '../common/Button';
import { money_format } from '../../utils/formatUtils';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({
  title,
  stock,
  price,
  onBuy,
  onStockClick,
  platform,
  onGetTotalStock,
  accountID,
  category,
  productRaw, // pass the full product object for navigation
  loading = false
}) => {
  const [totalStock, setTotalStock] = useState(null);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const navigate = useNavigate();

  // Fetch total in stock on mount or when accountID changes
  useEffect(() => {
    let cancelled = false;
    if (!onGetTotalStock || !accountID) {
      setTotalStock(null);
      return;
    }
    setLoadingTotal(true);
    onGetTotalStock(accountID)
      .then((total) => {
        if (!cancelled) setTotalStock(total);
      })
      .catch(() => {
        if (!cancelled) setTotalStock("N/A");
      })
      .finally(() => {
        if (!cancelled) setLoadingTotal(false);
      });
    return () => {
      cancelled = true;
    };
  }, [onGetTotalStock, accountID]);

  // Use platform icon if available, else fallback
  const iconSrc = platform?.icon || "/icons/facebook.svg";
  const iconAlt = platform?.name || "Platform";

  // Format totalStock as a number with commas, fallback to string if not a number
  const formattedTotalStock =
    typeof totalStock === "number"
      ? totalStock.toLocaleString("en-NG")
      : totalStock;

  // Handle card click: navigate to BuyAccountPage with details
  const handleCardClick = () => {
    navigate(`/dashboard/accounts/buy/${accountID}`, {
      state: {
        platform,
        category,
        product: productRaw || {
          title,
          price,
          stock,
          accountID,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-4 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg- rounded-xl p-4 shadow-[0_2px_2px_rgba(0,0,0,0.10)] border-b-2 border-[#FEBB4F] flex flex-col justify-between min-h-[120px] cursor-pointer bg-gradient-to-tl from-rose-50/50 to-white-50"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      style={{ outline: "none" }}
    >
      {/* Mobile Layout */}
      <div className="flex sm:hidden">
        {/* Icon */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white mr-3">
          <img src={iconSrc} alt={iconAlt} className="w-7 h-7 object-contain" />
        </div>
        {/* Info and Actions */}
        <div className="flex-1 flex flex-col ">
          <div className="font-bold text-sm text-text-primary/80">{title}</div>
          <button
            className="text-[13px] text-primary font-medium mt-1 text-left"
            onClick={e => { e.stopPropagation(); onStockClick && onStockClick(); }}
            disabled
          >
            {loadingTotal
              ? "Loading stock..."
              : formattedTotalStock !== null && formattedTotalStock !== undefined
                ? `${formattedTotalStock} Accounts in Stock`
                : "Accounts in Stock"}
          </button>
          <div className="flex justify-between items-center mt-2">
            <div className="font-bold text-lg text-primary mr-4">{money_format(price)}</div>
            <Button
              variant="orange"
              size="sm"
              icon={<FaShoppingCart />}
              onClick={e => {
                e.stopPropagation();
                navigate(`/dashboard/accounts/buy/${accountID}`, {
                  state: {
                    platform,
                    category,
                    product: productRaw || {
                      title,
                      price,
                      stock,
                      accountID,
                    },
                  },
                });
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-col justify-between min-h-[200px]">
        <div className="flex md:flex-col gap-3">
          <div className="flex md:flex-col gap-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-start mt-1">
              <img src={iconSrc} alt={iconAlt} className="w-8 h-8 mb-2 object-contain" />
            </div>
            <div className="flex md:flex-col gap-1">
              <div className='items-center'>
                <h3 className="font-bold text-[15px] text-text-primary leading-tight">{title}</h3>
              </div>
            </div>
          </div>
          <div className="">
            <div className='flex justify-between items-center'>
              <button
                className="text-xs text-primary font-medium mb-2"
                onClick={e => { e.stopPropagation(); onStockClick && onStockClick(); }}
                disabled
              >
                {loadingTotal
                  ? "Loading stock..."
                  : formattedTotalStock !== null && formattedTotalStock !== undefined
                    ? `${formattedTotalStock} Accounts in Stock`
                    : "Accounts in Stock"}
              </button>
            </div>
          </div>
        </div>
        <div className=" items-end justify-between mt-1">
          <div className="font-bold text-lg text-text-primary mb-4">{money_format(price)}</div>
          <Button
            variant="quinary"
            size="sm"
            onClick={e => { e.stopPropagation(); onBuy && onBuy(); }}
          >
            <img className='w-4 h-4 mr-2' src="/icons/cart.svg" alt="" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;