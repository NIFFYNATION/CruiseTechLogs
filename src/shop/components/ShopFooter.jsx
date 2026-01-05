import React from 'react';
import { Link } from 'react-router-dom';
import { useShopData } from '../hooks/useShopData';

const CategoryLinks = () => {
  const { categories, loading } = useShopData();
  const display = categories.filter(c => c.id !== 'all').slice(0, 6);
  if (loading && display.length === 0) {
    return (
      <ul className="space-y-3">
        <li><Link className="text-sm text-[#6b7280]" to="/shop/categories">Loading...</Link></li>
      </ul>
    );
  }
  if (display.length === 0) {
    return (
      <ul className="space-y-3">
        <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/shop/categories">Browse Categories</Link></li>
      </ul>
    );
  }
  return (
    <ul className="space-y-3">
      {display.map(cat => (
        <li key={cat.id}>
          <Link
            className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors"
            to={`/shop/products?category=${cat.id}`}
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ShopFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-gray-100 to-gray-200 pt-20 pb-10 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8 rounded-lg bg-[#ff6a00] text-white">
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-[#0f1115]">Cruise Gifts</span>
              </div>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                Spreading joy one package at a time. The world's most trusted gifting platform for moments that matter.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#0f1115] mb-6 text-base">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/shop/products">Shop All</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/shop/categories">Categories</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/shop/cart">Cart</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/shop/orders">Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0f1115] mb-6 text-base">Support</h4>
              <ul className="space-y-3">
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/dashboard/help-center">Help Center</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/shop/orders">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0f1115] mb-6 text-base">Categories</h4>
              <CategoryLinks />
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#6b7280]">© 2024 Cruise Gifts. All rights reserved.</p>
            <div className="flex gap-6">
              <Link className="text-xs text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/privacy-policy">Privacy Policy</Link>
              <Link className="text-xs text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="/terms">Terms and Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default ShopFooter;
