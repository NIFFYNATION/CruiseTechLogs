import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

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
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Shop All</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Bestsellers</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">New Arrivals</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0f1115] mb-6 text-base">Support</h4>
              <ul className="space-y-3">
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Help Center</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Track Order</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Returns & Refunds</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0f1115] mb-6 text-base">Stay Connected</h4>
              <p className="text-sm text-[#6b7280] mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
              <div className="flex gap-3 mb-6">
                <Link className="size-9 rounded-full bg-white flex items-center justify-center text-[#6b7280] hover:bg-[#ff6a00] hover:text-white transition-colors shadow-sm border border-gray-200 hover:border-[#ff6a00]" to="#" aria-label="Instagram">
                  <FaInstagram className="text-sm" />
                </Link>
                <Link className="size-9 rounded-full bg-white flex items-center justify-center text-[#6b7280] hover:bg-[#ff6a00] hover:text-white transition-colors shadow-sm border border-gray-200 hover:border-[#ff6a00]" to="#" aria-label="Facebook">
                  <FaFacebookF className="text-sm" />
                </Link>
                <Link className="size-9 rounded-full bg-white flex items-center justify-center text-[#6b7280] hover:bg-[#ff6a00] hover:text-white transition-colors shadow-sm border border-gray-200 hover:border-[#ff6a00]" to="#" aria-label="Twitter">
                  <FaTwitter className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#6b7280]">© 2024 Cruise Gifts. All rights reserved.</p>
            <div className="flex gap-6">
              <Link className="text-xs text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Privacy Policy</Link>
              <Link className="text-xs text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Terms of Service</Link>
              <Link className="text-xs text-[#6b7280] hover:text-[#ff6a00] transition-colors" to="#">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default ShopFooter;
